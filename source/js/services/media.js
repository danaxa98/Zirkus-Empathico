define('services/media', ['jsb', 'jquery', 'logging', 'services/LocalStorage'], function(jsb, $, logging, localStorage)
{
	var MediaService = function()
	{
		var that = this;

		logging.applyLogging(this, 'MediaService');

	};

	MediaService.prototype.playbackMediaInDomElement = function(options) {
        var that = this;

        domElement = $(options.domElement);
        domElement.empty();
        var completeCallback = options.completeCallback || null;
        var loadedCallback = options.loadedCallback || null;
        options.autoStart = options.autoStart || false;
        options.placeholder = options.placeholder || null;
        options.volume = options.volume || 1;

        options.absoluteMediaPath = localStorage.getAbsolutePathForRelativeMediaPath(options.relativeMediaPath);

        if (options.placeholder) {
            domElement.attr('poster', localStorage.getAbsolutePathForRelativeMediaPath('media/images/black.png'));
        }

        domElement.attr('webkitPlaysinline', 'webkitPlaysinline');

        domElement[0].volume = options.volume;

        domElement.removeAttr('loop');
        if (options.loop) {
            domElement.attr('loop','loop');
        }

        domElement.find('source').off('error');
        domElement.off('ended');
        if (options.absoluteMediaPath.indexOf(".mp3") > -1) {
            domElement.append('<source src="' + options.absoluteMediaPath + '" type="audio/mpeg" />');
        } else if (options.absoluteMediaPath.indexOf(".mp4") > -1) {
            domElement.append('<source src="' + options.absoluteMediaPath + '" type="video/mp4"/>');
        } else {
            domElement.append('<source src="' + options.absoluteMediaPath + '"/>');
        }

        if (completeCallback) {
            domElement.one('ended', function() {
                domElement[0].pause();
                domElement[0].currentTime = 0;
                completeCallback();
            });
            domElement.find('source').one('error', function() {
                completeCallback();
            });
        }
        
        domElement[0].load();
        if (loadedCallback) {
            loadedCallback();
        }


        try {
            domElement[0].currentTime = 0;
        } catch (error) {

        }

        if (options.autoStart) {
            domElement.attr('autoplay', 'autoplay');
            domElement[0].play();
        }
	};

	return new MediaService();

});
