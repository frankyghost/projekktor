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
        {ext:'m3u8', type:'application/vnd.apple.mpegurl', platform: ['ios', 'android', 'native'], streamType: ['http','httpVideo', 'httpVideoLive']},
        {ext:'m3u', type:'application/vnd.apple.mpegurl', platform: ['ios', 'android', 'native'], streamType: ['http', 'httpVideo', 'httpVideoLive']},             
        {ext:'m3u8', type:'application/x-mpegurl', platform: ['ios', 'android', 'native'], streamType: ['http','httpVideo', 'httpVideoLive']},
        {ext:'m3u', type:'application/x-mpegurl', platform: ['ios', 'android', 'native'], streamType: ['http', 'httpVideo', 'httpVideoLive']}    
    ]
    
}, 'VIDEO');

$p.newModel({    
    modelId: 'AUDIOHLS',    
    androidVersion: 4,
    iosVersion: 3,
    iLove: [
        {ext:'m3u8', type:'application/vnd.apple.mpegurl', platform: ['ios', 'android', 'native'], streamType: ['http','httpAudio', 'httpAudioLive']},
        {ext:'m3u', type:'application/vnd.apple.mpegurl', platform: ['ios', 'android', 'native'], streamType: ['http','httpAudio', 'httpAudioLive']},             
        {ext:'m3u8', type:'application/x-mpegurl', platform: ['ios', 'android', 'native'], streamType: ['http','httpAudio', 'httpAudioLive']},
        {ext:'m3u', type:'application/x-mpegurl', platform: ['ios', 'android', 'native'], streamType: ['http','httpAudio', 'httpAudioLive']},    
        {ext:'m3u8', type:'audio/mpegurl', platform: ['ios', 'android', 'native'], streamType: ['http','httpAudio', 'httpAudioLive']},
        {ext:'m3u', type:'audio/mpegurl', platform: ['ios', 'android', 'native'], streamType: ['http', 'httpAudio', 'httpAudioLive']},
        {ext:'m3u8', type:'audio/x-mpegurl', platform: ['ios', 'android', 'native'], streamType: ['http','httpAudio', 'httpAudioLive']},
        {ext:'m3u', type:'audio/x-mpegurl', platform: ['ios', 'android', 'native'], streamType: ['http', 'httpAudio', 'httpAudioLive']}
    ]
    
}, 'AUDIO');

});