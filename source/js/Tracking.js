define('Tracking', ['jsb', 'logging', 'jquery', 'services/LocalStorage', 'store'],
    function(jsb, logging, $, localStorage, store)
{
    "use strict";

    var Tracking = function(domElement, options) {
		this.domElement = $(domElement);
		logging.applyLogging(this, 'Tracking');
		this.initializeListeners();
        this.sendDeferedActivities();
	};

	Tracking.prototype.initializeListeners = function() {
		var that = this;
		jsb.whenFired('Tracking::ACTIVITY', function(event) {
			var publishedAt = new Date();
			that.logDebug('Activity:', event.verb, 'at', ('0' + publishedAt.getHours()).substr(-2) + ':' + ('0' + publishedAt.getMinutes()).substr(-2) + ':' + ('0' + publishedAt.getSeconds()).substr(-2));
			that.logDebug(' o Actor', event.actor);
			that.logDebug(' o Object', event.object);
			that.logDebug(' o Target', event.target);
            that.queueActivity(localStorage.getSessionId(), {
                "actor": event.actor,
                "object": event.object,
                "target": event.target,
                "verb": event.verb,
                "createdAt": publishedAt,
                "updatedAt": publishedAt
            });
		});
	};

    Tracking.prototype.queueActivity = function(importId, activity) {
        var that = this;
        $.ajax({
            "url": "https://zirkus-empathico.herokuapp.com/api/import?importId=" + encodeURIComponent(importId)+"&deviceId=" + encodeURIComponent(localStorage.getDeviceId()),
            "type": "POST",
            "contentType": "application/json",
            "data": JSON.stringify([
                activity
            ]),
            "success": function() {

            },
            "error": function() {
                that.logDebug('Storing the activity did not work, let\'s store it for later');
                that.deferActivity(importId, activity);
            }
        });
    };

    Tracking.prototype.deferActivity = function(importId, activity) {
        var that = this;

        var deferedIndexes = JSON.parse(store.get('deferedIndexes') || '[]');
        if (deferedIndexes.indexOf(importId) === -1) {
            deferedIndexes.push(importId);
            store.set('deferedIndexes', JSON.stringify(deferedIndexes));
        }
        var storeKey = 'deferedActivities-' + importId;
        var deferedActivities = JSON.parse(store.get(storeKey) || '[]');
        deferedActivities.push(activity);
        store.set(storeKey, JSON.stringify(deferedActivities));
    };

    Tracking.prototype.sendDeferedActivities = function() {
        var that = this;
        var deferedIndexes = JSON.parse(store.get('deferedIndexes') || '[]');

        deferedIndexes.forEach(function(importId) {
            if (importId == localStorage.getSessionId()) {
                /* Do not sync the current session */
                return ;
            }

            that.logDebug("Try to store backup of " + importId);
            var storeKey = 'deferedActivities-' + importId;
            var deferedActivities = JSON.parse(store.get(storeKey) || '[]');
            if (deferedActivities.length) {
                $.ajax({
                    "url": "https://zirkus-empathico.herokuapp.com/api/import?importId=" + encodeURIComponent(importId)+"&deviceId=" + encodeURIComponent(localStorage.getDeviceId()),
                    "type": "POST",
                    "contentType": "application/json",
                    "data": JSON.stringify(deferedActivities),
                    "success": function() {
                        that.logDebug("Managed to store backup of " + importId);
                        that.logDebug("Cleanup local storage for this importId now!");
                        store.remove(storeKey);

                        var deferedIndexes = JSON.parse(store.get('deferedIndexes') || '[]');
                        var otherDeferedIndexes = [];
                        deferedIndexes.forEach(function(otherDeferedIndex) {
                            if (otherDeferedIndex != importId) {
                                otherDeferedIndexes.push(otherDeferedIndex);
                            }
                        });
                        store.set('deferedIndexes', JSON.stringify(otherDeferedIndexes));
                        that.logDebug("Removed this importId from deferedIndexes");
                    }
                });
            }
        });
    };

    return Tracking;
});
