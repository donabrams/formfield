require(["state-machine"], function () {
	createCoaStateMachine = function() {
		var coaSM = StateMachine.create({
			  state: 'Start',
				events: [
						//initial states after loading
						{ name: 'New', 							from: 'Start', 						to: 'Blank'},
						{ name: 'Editing', 					from: 'Start', 						to: 'Edit'},
						{ name: 'Existing', 				from: 'Start', 						to: 'View'},
						//blank <-> edit
						{ name: 'NextStep', 				from: 'Blank', 						to: 'Edit'},
						{ name: 'ChangeSpeedtype', 	from: 'Edit', 						to: 'Blank'},
						//view <-> [edit, blank]
						{ name: 'MakeChanges', 			from: 'View', 						to: 'Edit'},
						{ name: 'CancelChanges', 		from: ['Blank','Edit'], 	to: 'View'},
						//page triggered save process
						{ name: 'Save',							from: ['Blank','Edit'],		to: 'View'},
						//on page unload/caching process
						{ name: 'PageUnloading', 		from: ['Blank','Edit'], 	to: 'HiddenKey'},
		]});
// These are transition functions. Returning false stops the transition.
		coaSM.onbeforeNextStep = function(name, from, to, coa, formNode) {
			if (!coa.loadForm(formNode) || !coa.loadSpeedtypeData()) {
				coa.showBlankTemplate(formNode);
				return false;
			}
		};
		coaSM.onbeforeMakeChanges = function(name, from, to, coa, formNode) {
			if (!coa.isEditable)
				return false;
		};
		coaSM.onbeforeCancelChanges = function(name, from, to, coa, formNode) {
			if (!coa.hasValidSavedState)
				return false;
		};
		//You may want to override this to be more specific
		coaSM.onbeforeSaveMessage = "You must complete or delete this Chart of Accounts before continuing.";
		coaSM.onbeforeSave = function(name, from, to, coa, formNode) {
			if (from == "Blank") {
				coa.addError(coaSM.onbeforeSaveMessage);
				coa.showBlankTemplate(formNode);
				return false;
			}
			if (from == "Edit" && (!coa.loadForm(formNode) || !coa.save())) {
				coa.showEditTemplate(formNode);
				return false;
			}
		};
		coaSM.onbeforePageUnloading = function(name, from, to, coa, formNode) {
			coa.loadForm(formNode)
			coa.saveToCache();
		};
	//These are end states
		coaSM.onBlank = function(name, from, to, coa, formNode) {
			coa.showBlankTemplate(formNode);
		};
		coaSM.onEdit = function(name, from, to, coa, formNode) {
			coa.showEditTemplate(formNode);
		};
		coaSM.onView = function(name, from, to, coa, formNode) {
			coa.showViewTemplate(formNode);
		};
		coaSM.onHiddenKey = function(name, from, to, coa, formNode) {
			coa.deactivateAllFieldsThenAppendHiddenTemplate(formNode);
		};
		return coaSM;
	};
});
