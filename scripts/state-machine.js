StateMachine = {

  //---------------------------------------------------------------------------

  VERSION: "2.0.0",

  //---------------------------------------------------------------------------

  create: function(cfg, target) {

    var initial   = (typeof cfg.initial == 'string') ? { state: cfg.initial } : cfg.initial; // allow for a simple string, or an object with { state: 'foo', event: 'setup', defer: true|false }
    var fsm       = target || cfg.target  || {};
    var events    = cfg.events || [];
    var callbacks = cfg.callbacks || {};
    var map       = {};

    var add = function(e) {
      var from = (e.from instanceof Array) ? e.from : [e.from];
      map[e.name] = map[e.name] || {};
      for (var n = 0 ; n < from.length ; n++)
        map[e.name][from[n]] = e.to;
    };

    if (initial) {
      initial.event = initial.event || 'startup';
      add({ name: initial.event, from: 'none', to: initial.state });
    }

    for(var n = 0 ; n < events.length ; n++)
      add(events[n]);

    for(var name in map) {
      if (map.hasOwnProperty(name))
        fsm[name] = StateMachine.buildEvent(name, map[name]);
    }

    for(var name in callbacks) {
      if (callbacks.hasOwnProperty(name))
        fsm[name] = callbacks[name]
    }

    fsm.current = 'none';
    fsm.is      = function(state) { return this.current == state; };
    fsm.can     = function(event) { return !!map[event][this.current] && !this.transition; };
    fsm.cannot  = function(event) { return !this.can(event); };

    if (initial && !initial.defer)
      fsm[initial.event]();

    return fsm;

  },
  

  //===========================================================================
  
  // These functions all take the arguments [name, from, to] and an optional 4th argument
  // which is an array or values to be applied on the function as additional arguments
  _do: function(args) {
    for (var i = 1;i < arguments.length;i++) {
      if (this[arguments[i]]) {
        return this[arguments[i]].apply(this, args.slice(0,3).concat(args[3]));
      }
    }
  },
  beforeEvent: function(name) {
    return StateMachine._do(arguments, 'onbefore' + name);
  },
  afterEvent: function(name) {
    return StateMachine._do(arguments, 'onafter' + name, 'on' + name);
  },
  leaveState: function(name, from) {
    return StateMachine._do(arguments, 'onleave' + from);
  },
  enterState: function(name, from, to) {
    return StateMachine._do(arguments, 'onenter' + to, 'on' + to);
  },
  changeState: function() {
    return StateMachine._do(arguments, 'onchangestate');
  },

  buildEvent: function(name, map) {
    return function() {

      if (this.transition)
        throw "event " + name + " innapropriate because previous transition did not complete"

      if (this.cannot(name))
        throw "event " + name + " innapropriate in current state " + this.current;

      var from  = this.current;
      var to    = map[from];
      var args  = Array.prototype.slice.call(arguments); // turn arguments into pure array

      if (this.current != to) {

        if (false === StateMachine.beforeEvent.call(this, name, from, to, args))
          return;

        var self = this;
        this.transition = function() { // prepare transition method for use either lower down, or by caller if they want an async transition (indicated by a false return value from leaveState)
          self.transition = null; // this method should only ever be called once
          self.current = to;
          StateMachine.enterState.call( self, name, from, to, args);
          StateMachine.changeState.call(self, name, from, to, args);
          StateMachine.afterEvent.call( self, name, from, to, args);
        };

        if (false !== StateMachine.leaveState.call(this, name, from, to, args)) {
          if (this.transition) // in case user manually called it but forgot to return false
            this.transition();
        }
      }

    };
  }

  //===========================================================================

};

