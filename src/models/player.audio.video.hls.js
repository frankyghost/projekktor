/*
 * this file is part of: 
 * projekktor zwei
 * http://www.projekktor.com
 *
 * Copyright 2014, Sascha Kluger, Spinning Airwhale Media, http://www.spinningairwhale.com
 * under GNU General Public License
 * http://www.filenew.org/projekktor/license/
*/
jQuery(function($) {
    
$p.newModel({    
    modelId: 'VIDEOHLS',    
    androidVersion: 4,
    iosVersion: 3,    
    iLove: [
        {ext:'m3u8', type:'application/mpegURL', platform: ['ios', 'android'], streamType: ['http','httpVideo', 'httpVideoLive']},
        {ext:'m3u', type:'application/mpegURL', platform: ['ios', 'android'], streamType: ['http', 'httpVideo', 'httpVideoLive']},
        {ext:'m3u8', type:'application/vnd.apple.mpegURL', platform: ['ios', 'android'], streamType: ['http','httpVideo', 'httpVideoLive']},
        {ext:'m3u', type:'application/vnd.apple.mpegURL', platform: ['ios', 'android'], streamType: ['http', 'httpVideo', 'httpVideoLive']},             
        {ext:'m3u8', type:'application/x-mpegURL', platform: ['ios', 'android'], streamType: ['http','httpVideo', 'httpVideoLive']},
        {ext:'m3u', type:'application/x-mpegURL', platform: ['ios', 'android'], streamType: ['http', 'httpVideo', 'httpVideoLive']}    
    ]
    
}, 'VIDEO');

$p.newModel({    
    modelId: 'AUDIOHLS',    
    androidVersion: 4,
    iosVersion: 3,
    iLove: [
        {ext:'m3u8', type:'application/mpegURL', platform: ['ios', 'android'], streamType: ['http','httpAudio', 'httpAudioLive']},
        {ext:'m3u', type:'application/mpegURL', platform: ['ios', 'android'], streamType: ['http','httpAudio', 'httpAudioLive']},
        {ext:'m3u8', type:'application/vnd.apple.mpegURL', platform: ['ios', 'android'], streamType: ['http','httpAudio', 'httpAudioLive']},
        {ext:'m3u', type:'application/vnd.apple.mpegURL', platform: ['ios', 'android'], streamType: ['http','httpAudio', 'httpAudioLive']},             
        {ext:'m3u8', type:'application/x-mpegURL', platform: ['ios', 'android'], streamType: ['http','httpAudio', 'httpAudioLive']},
        {ext:'m3u', type:'application/x-mpegURL', platform: ['ios', 'android'], streamType: ['http','httpAudio', 'httpAudioLive']},    
        {ext:'m3u8', type:'audio/mpegURL', platform: ['ios', 'android'], streamType: ['http','httpAudio', 'httpAudioLive']},
        {ext:'m3u', type:'audio/mpegURL', platform: ['ios', 'android'], streamType: ['http', 'httpAudio', 'httpAudioLive']}
    ]
    
}, 'AUDIO');

});