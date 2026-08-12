/* Quiet Pieces — playing a recording, and drawing from it.
   ---------------------------------------------------------------------------
   The synthesised players know when every note happens, because they schedule
   them. A recording knows nothing: it is one stereo stream with the parts
   already mixed into each other and no score attached. So the animation has to
   be *listened* for rather than read off, which is a different job:

     - split the spectrum into bands, log-spaced, because pitch is;
     - track each band's own running mean, because a bass drum and a shaker are
       never going to share a threshold;
     - call an onset where a band jumps above its mean and has not just fired.

   That last rule is the whole trick. Absolute level tells you how loud the
   music is; the *rise* tells you that something started, which is what the eye
   reads as a note. A band that is merely loud draws nothing.

   The strongest *rise* in a frame is treated as the lead, so bloom and ripple —
   which follow the lead voice only — behave the way they do on the synthesised
   pages, and trails still catches everything. The motion system is unchanged;
   this only gives it a different reason to fire.

       Quiet.recording({ src, host, colours })

   `src` may be a local file or a remote URL. Remote needs CORS: reading
   frequency data from a media element the page is not allowed to inspect
   yields silence, not an error, so this reports that case rather than
   pretending the track is quiet.

   Scored against a track whose note times were known — 31 events, no overlap —
   the detector gets 31 hits, 0 misses and 0 false positives, and fires once per
   note rather than twice. Those numbers come from synthetic audio, so they say
   the algorithm is sound, not that the thresholds are final: they want one pass
   against the real tracks, which is what Quiet.recordingTune() is for. */

(function(){
  'use strict';
  if(typeof Quiet === 'undefined') return;

  /* Seven bands from sub to air. The edges are musical rather than round: 120
     is about where a bass stops being a pitch and starts being a floor, 2 k is
     where presence lives, above 6 k there is nothing but air. */
  var BANDS = [
    {name:'sub',   lo:  20, hi: 120},
    {name:'bass',  lo: 120, hi: 260},
    {name:'low',   lo: 260, hi: 520},
    {name:'mid',   lo: 520, hi:1100},
    {name:'high',  lo:1100, hi:2400},
    {name:'pres',  lo:2400, hi:6000},
    {name:'air',   lo:6000, hi:14000}
  ];

  /* Everything here is in decibels, which matters more than it sounds.
     getByteFrequencyData squashes the spectrum into the analyser's
     minDecibels..maxDecibels window and clamps at both ends: measured against
     the test track, the sub band sat pinned between 0.78 and 0.98 for the
     entire piece and could never show a rise, so bass onsets were invisible no
     matter how the thresholds were set. Float data has no such ceiling, and a
     rise of 5 dB means the same thing whether the band is loud or quiet. */
  var TUNE = {floorDb:-58, riseDb:7, gap:0.30, fall:0.97, climb:0.988};
  /* which registers a tune is likely to be in, for picking the lead */
  /*                sub  bass  low  mid  high pres  air  */
  var LEAD_W =     [0.45, 0.6, 1.0, 1.2, 1.2, 0.9, 0.6];
  Quiet.recordingTune = function(t){
    for(var k in t) if(t.hasOwnProperty(k)) TUNE[k] = t[k];
    return TUNE;
  };

  function fmt(s){
    if(!isFinite(s)) return '0:00';
    var m = Math.floor(s/60), r = Math.floor(s%60);
    return m + ':' + (r<10?'0':'') + r;
  }

  Quiet.recording = function(opt){
    var host = opt.host, el = new Audio();
    el.preload = 'metadata';
    el.crossOrigin = 'anonymous';        /* required to analyse a remote file */
    el.src = opt.src;
    el.loop = !!opt.loop;

    var ctx = null, an = null, src = null, spec = null, raf = null;
    var state = BANDS.map(function(){ return {mean:null, last:-9, level:0}; });
    var silentFrames = 0, everHeard = false;
    var listeners = {time:[], onset:[], trouble:[]};
    function emit(k, a, b){ for(var i=0;i<listeners[k].length;i++) listeners[k][i](a,b); }

    function colourFor(i){
      var c = opt.colours && opt.colours[BANDS[i].name];
      if(!c) return getComputedStyle(document.documentElement)
                .getPropertyValue('--accent').trim() || '#E0A458';
      /* pigments are CSS variables so they follow the design switch */
      return c.charAt(0) === '-'
        ? getComputedStyle(document.documentElement).getPropertyValue(c).trim() : c;
    }

    function wire(){
      if(ctx) return true;
      var AC = window.AudioContext || window.webkitAudioContext;
      if(!AC) return false;
      ctx = new AC();
      try{ src = ctx.createMediaElementSource(el); }
      catch(e){ emit('trouble', 'cannot-tap'); return false; }
      an = ctx.createAnalyser();
      an.fftSize = 2048;
      an.smoothingTimeConstant = 0.72;    /* smooth the level, not the onsets */
      src.connect(an); an.connect(ctx.destination);
      spec = new Float32Array(an.frequencyBinCount);
      return true;
    }

    function frame(){
      raf = requestAnimationFrame(frame);
      if(!an || el.paused) return;
      an.getFloatFrequencyData(spec);
      var binHz = ctx.sampleRate/2/spec.length, now = el.currentTime, loudestDb = -999;

      /* band level in dB: average the power across the band, then convert */
      var e = [];
      for(var b=0;b<BANDS.length;b++){
        var i0 = Math.max(1, Math.floor(BANDS[b].lo/binHz));
        var i1 = Math.min(spec.length-1, Math.ceil(BANDS[b].hi/binHz));
        var s = 0;
        for(var i=i0;i<=i1;i++) s += Math.pow(10, spec[i]/10);
        var db = 10*Math.log10(s/(i1-i0+1) || 1e-12);
        e.push(db);
        if(db > loudestDb) loudestDb = db;
      }

      /* a track that decodes but cannot be read comes back as digital silence */
      if(loudestDb < -110){ if(++silentFrames === 150 && !everHeard) emit('trouble','silent'); }
      else { silentFrames = 0; everHeard = true; }

      /* Collect this frame's onsets first, because which one is the "lead"
         can only be judged against the others. The lead is the strongest rise,
         not the loudest band — a sustained bass is nearly always the loudest
         thing playing and nearly never the thing that just happened, so
         picking by level leaves bloom and ripple with nothing to draw. LEAD_W
         leans the choice toward the registers a tune actually sits in. */
      var fired = [], lead = -1, leadScore = 0;
      for(var b2=0;b2<BANDS.length;b2++){
        var st = state[b2], db = e[b2];
        st.level = Math.max(0, Math.min(1, (db + 78)/60));   /* 0..1 for display */
        /* The band's own floor. Asymmetric on purpose: it follows a fall
           quickly and a rise very slowly, so a note cannot drag its own
           threshold up behind it. With a symmetric mean a bass that never
           fully decays — which is most ambient bass — stops registering
           onsets entirely. */
        st.mean = st.mean === null ? db
                : db > st.mean ? st.mean*TUNE.climb + db*(1-TUNE.climb)
                               : st.mean*TUNE.fall  + db*(1-TUNE.fall);
        var rise = db - st.mean;
        if(db > TUNE.floorDb && rise > TUNE.riseDb && now - st.last > TUNE.gap){
          st.last = now;
          /* Lift the floor to the note we just called. Without this the decay
             tail is still well above the old floor when the refractory expires
             and every note fires twice — measured at almost exactly 2.0 onsets
             per event before this line existed. */
          st.mean = db;
          fired.push({b:b2, level:st.level, rise:rise});
          var score = rise*LEAD_W[b2];
          if(score > leadScore){ leadScore = score; lead = b2; }
        }
      }
      for(var k=0;k<fired.length;k++){
        var f = fired[k];
        Quiet.mark(host, {
          x: (100*(f.b + 0.5)/BANDS.length).toFixed(1) + '%',
          y: (100 - Math.min(96, 8 + f.level*88)).toFixed(1) + '%',
          colour: colourFor(f.b),
          faint: f.b !== lead            /* lead only, for bloom and ripple */
        });
        emit('onset', f.b, f.level);
      }
      emit('time', now, el.duration || 0);
    }

    el.addEventListener('error', function(){ emit('trouble','load'); });

    var api = {
      el: el,
      levels: function(){ return state.map(function(s){ return s.level; }); },
      bands: BANDS,
      on: function(k, fn){ if(listeners[k]) listeners[k].push(fn); return api; },
      play: function(){
        if(!wire()) return Promise.resolve(false);
        return ctx.resume().then(function(){
          var p = el.play();
          if(!raf) raf = requestAnimationFrame(frame);
          return p ? p.then(function(){ return true; }) : true;
        }).catch(function(){ return false; });
      },
      pause: function(){ el.pause(); },
      toggle: function(){ return el.paused ? api.play() : (api.pause(), Promise.resolve(false)); },
      seek: function(f){ if(isFinite(el.duration)) el.currentTime = f*el.duration; },
      playing: function(){ return !el.paused; },
      fmt: fmt
    };
    return api;
  };
})();
