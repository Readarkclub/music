/* Quiet Pieces — the shared design and motion system.
   ---------------------------------------------------------------------------
   Load this in <head>, synchronously, before the page renders: it stamps the
   saved design onto <html> before first paint, so changing pages or reloading
   never flashes the other one.

   A page opts in to the switches with an empty container:

       <div class="prefs" data-quiet-switch="design motion"></div>

   and asks for a mark whenever a note sounds:

       Quiet.mark(hostElement, {x:'43%', y:'50%', colour:'#E0A458', faint:false});

   `x`/`y` are where on the instrument the note happened, as CSS lengths inside
   the host (which must be position:relative). The mark is centred there. Marks
   come from a pool per host, recycled, so the element count stays flat however
   dense the music gets — set the size with data-qm-pool on the host.

   Quiet.onChange(fn) fires after either switch moves; use it to re-read any
   colour you cached, since the pigments differ per design. */

var Quiet = (function(){
  'use strict';

  var STYLES  = [['nocturne','Nocturne'], ['classical','Classical']];
  var MOTIONS = [['bloom','Bloom'], ['ripple','Ripple'], ['trails','Trails'], ['still','Still']];
  var root = document.documentElement;
  var listeners = [];
  var pools = [];          /* [host, {els, at}] — hosts are few, so a list is fine */

  /* ---- restore before first paint ---- */
  var savedStyle = null, savedMotion = null;
  try{
    savedStyle  = localStorage.getItem('qp-style');
    savedMotion = localStorage.getItem('qp-motion');
  }catch(e){}
  root.setAttribute('data-style', savedStyle === 'classical' ? 'classical' : 'nocturne');
  if(!savedMotion){
    var quiet = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    savedMotion = quiet ? 'still' : 'bloom';
  }
  root.setAttribute('data-motion', savedMotion);

  function poolFor(host){
    for(var i=0;i<pools.length;i++) if(pools[i][0] === host) return pools[i][1];
    var n = +(host.getAttribute('data-qm-pool') || 16), p = {els:[], at:0};
    for(var k=0;k<n;k++){
      var d = document.createElement('div');
      d.className = 'qm';
      host.appendChild(d);
      p.els.push(d);
    }
    pools.push([host, p]);
    return p;
  }

  function clearMarks(){
    var all = document.querySelectorAll('.qm');
    for(var i=0;i<all.length;i++) all[i].className = 'qm';
  }

  function repaintSwitches(){
    var bs = document.querySelectorAll('[data-quiet-switch] button[data-attr]');
    for(var i=0;i<bs.length;i++){
      bs[i].setAttribute('aria-pressed',
        String(bs[i].dataset.v === root.getAttribute(bs[i].dataset.attr)));
    }
  }

  function choose(attr, key, v){
    root.setAttribute(attr, v);
    try{ localStorage.setItem(key, v); }catch(e){}
    clearMarks();
    repaintSwitches();
    for(var i=0;i<listeners.length;i++){ try{ listeners[i](); }catch(e){} }
  }

  function segment(host, label, options, attr, key, quiet){
    var wrap = document.createElement('div');
    wrap.className = 'pref' + (quiet ? ' pref-quiet' : '');
    var lab = document.createElement('span');
    lab.className = 'prefl'; lab.textContent = label;
    var seg = document.createElement('div');
    seg.className = 'seg';
    seg.setAttribute('role','group');
    seg.setAttribute('aria-label', label);
    seg.dataset.switch = attr === 'data-style' ? 'design' : 'motion';
    options.forEach(function(o){
      var b = document.createElement('button');
      b.type = 'button';
      b.dataset.v = o[0];
      b.dataset.attr = attr;
      if(attr === 'data-style') b.innerHTML = '<i class="chip chip-' + o[0] + '"></i>';
      b.appendChild(document.createTextNode(o[1]));
      b.addEventListener('click', function(){ choose(attr, key, o[0]); });
      seg.appendChild(b);
    });
    wrap.appendChild(lab); wrap.appendChild(seg);
    host.appendChild(wrap);
  }

  function build(){
    var hosts = document.querySelectorAll('[data-quiet-switch]');
    for(var i=0;i<hosts.length;i++){
      var want = (hosts[i].getAttribute('data-quiet-switch') || 'design').split(/\s+/);
      if(want.indexOf('design') >= 0)
        segment(hosts[i], 'Design', STYLES, 'data-style', 'qp-style', false);
      if(want.indexOf('motion') >= 0)
        segment(hosts[i], 'Motion', MOTIONS, 'data-motion', 'qp-motion', true);
    }
    repaintSwitches();
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build);
  else build();

  return {
    style:  function(){ return root.getAttribute('data-style'); },
    motion: function(){ return root.getAttribute('data-motion'); },
    onChange: function(fn){ listeners.push(fn); },

    /* Ask for a mark. Returns false when the current mode draws nothing, so a
       caller can skip any work it would only have done for the mark. */
    mark: function(host, o){
      var mode = root.getAttribute('data-motion');
      if(mode === 'still') return false;
      /* bloom and ripple follow the piece's lead voice only; trails follows
         every part, which is what makes it a roll of the whole texture */
      if(mode !== 'trails' && o.faint) return false;
      var p = poolFor(host), el = p.els[p.at++ % p.els.length];
      el.className = 'qm';
      void el.offsetWidth;                       /* restart the animation */
      el.style.setProperty('--kc', o.colour);
      el.style.setProperty('--qm-x', o.x);
      el.style.setProperty('--qm-y', o.y || '100%');
      el.className = 'qm qm-' + mode + (o.faint ? ' qm-faint' : '');
      return true;
    }
  };
})();
