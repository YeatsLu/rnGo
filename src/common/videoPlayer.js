import React, { PureComponent } from 'react'
import { Text, View, Image, Slider, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native'
import PropTypes from 'prop-types'

import Icon from 'react-native-vector-icons/MaterialIcons'
import Video from 'react-native-video'

import { dp2px as rem } from "../utils/size"

var formatTimer = function( v ) {
    let minutes = ( '0' + ~~(v / 60) ).slice(-2)
    let seconds = ( '0' + v % 60 ).slice(-2)

    return `${minutes}:${seconds}`
}

// TODO seek未缓存地方

export default class VideoPlayer extends PureComponent {
    constructor(prop) {
        super(prop)

        this.state = {
            // 初始界面是一个播放的遮罩
            masked: true,
            // 视频加载中
            loading: false,
            // 视频暂停与播放, 默认不播放
            paused: true,
            // 视频控制区显示与隐藏
            handled: false,

            // 当前时间
            currentTime: 0,
            // 总时间(秒数)
            duration: 0,

            // 视频计时数，只有分秒
            currentTimer: '00:00',
            totalTimer: ''
        }

        this.hideHandlerTimer = null

        // 视频进程( _onLoad是视频实例自己触发的，和用户点击播放的先后顺序不定 )：
        // 1. _onLoad -> _start -> _onProgress -> _onReadyForDisplay -> _onProgress -> _onEnd
        // 2. _start -> _onLoad -> _onProgress -> _onReadyForDisplay -> _onProgress -> _onEnd
    }
    _hideHandlerWithTimer() {
        // 默认一秒之后隐藏掉控制区
        this.hideHandlerTimer && clearTimeout( this.hideHandlerTimer )
        this.hideHandlerTimer = setTimeout( () => {
            this.setState({ handled: false })
        }, 2000)
    }
    _start = () => {
        // 点击播放
        // 去掉播放遮罩，默认开启播放, 显示视频加载中,
        // 这时可能还没有onLoad, 而onLoad之后，再若干次onProgress之后，
        // onProgress中加载可播放的时间，直到onReadyForDisplay才算是加载完毕
        this.setState({ masked: false, paused: false, loading: true })
    }
    _playOrPause = () => {
        this.setState({ paused: !this.state.paused })
    }
    _showOrHideHandler = () => {
        let handled = !this.state.handled
        this.setState({ handled })
        handled && this._hideHandlerWithTimer()
    }
    _onLoad = (evt) => {
        // 此回调会视频组件实例化后，第一个自己调用(视频加载到后)
        let duration = Math.round( evt.duration )
        // 视频加载完毕(但真正播放进行中是在onReadyForDisplay)，获得总的时间
        this.setState({ duration, totalTimer: formatTimer( duration ) })
    }
    _onProgress = (evt) => {
        let time = Math.round( evt.currentTime )

        let { currentTime } = this.state

        // 因为video progress回调250ms就触发一次，
        // 其实只需要每一秒更新一次就可以
        // 开始若干次播放进展都是0，直到触发 onReadyForDisplay
        if ( currentTime === time ) return

        // 视频播放进程中
        this.setState({ currentTimer: formatTimer( time ), currentTime: time })
    }
    _onEnd = () => {
        // 视频播放结束
        this.video.seek(0)
        this.setState({ paused: true, handled: true })
        this._hideHandlerWithTimer()
    }
    _onReadyForDisplay = () => {
        // 这里才开始真正的播放进程中，即视频计时器开始计时
        // 结束loading，显示控制区
        this.setState({ loading: false, handled: true })
        this._hideHandlerWithTimer()
    }
    _onSlidingComplete = (v) => {
        v = Math.round( v )

        // 视频计时器定位
        this.video.seek(v)

        // 如果当前是暂停状态，不再触发_onProgress，需要在此更新计时器，
        if ( this.state.paused ) {
            this.setState({ currentTimer: formatTimer( v ), currentTime: v })
        }
    }
    _renderHandler() {
        let { paused, handled, currentTime, duration, currentTimer, totalTimer } = this.state

        return (
            <View style={ SS.cover }>
                <TouchableOpacity onPress={ this._showOrHideHandler } style={ SS.handleTouch }/>
                { handled &&
                    <View style={ SS.handleBar }>
                        <TouchableOpacity onPress={ this._playOrPause }>
                            <Icon name={ paused ? 'pause' : 'play-arrow' } size={ CT.handleIconSize } color="#fff"/>
                        </TouchableOpacity>
                        <Text style={[ SS.time ]}>{ currentTimer }</Text>
                        <Slider
                            minimumTrackTintColor="#fff"
                            thumbTintColor="#fff"
                            maximumTrackTintColor="#e4e4e4"
                            maximumValue={ duration }
                            value={ currentTime }
                            style={ SS.slider }
                            onSlidingComplete={ this._onSlidingComplete }
                        />
                        <Text style={ SS.time }>{ totalTimer }</Text>
                    </View>
                }
            </View>
        )
    }
    _renderPoster( poster, size ) {
        return (
            <Image source={ poster } style={[ SS.poster, size ]}/>
        )
    }
    _renderLoading() {
        return (
            <ActivityIndicator animating={ true } size="large" color="#27a0ff" style={ SS.loading } />
        )
    }
    _renderMask() {
        return (
            <TouchableOpacity onPress={ this._start } style={ SS.mask }>
                <Icon name="play-circle-filled" size={ CT.playIconSize }/>
            </TouchableOpacity>
        )
    }
    render() {
        let { masked, loading, paused } = this.state
        let { source, poster, size, style } = this.props

        return (
            <View style={[ SS.container, size, style ]}>
                <Video
                    ref={ v => this.video = v }
                    resizeMode="contain"
                    // progressUpdateInterval={}
                    source={ source }
                    style={ size }
                    paused={ paused }
                    onLoad={ this._onLoad }
                    onProgress={ this._onProgress }
                    onEnd={ this._onEnd }
                    onReadyForDisplay={ this._onReadyForDisplay }
                />

                { this._renderHandler() }

                { (masked || loading) && this._renderPoster( poster, size ) }

                { loading && this._renderLoading() }

                { masked && this._renderMask() }
            </View>
        )
    }
}

VideoPlayer.propTypes = {
    source: Video.propTypes.source,
    poster: Image.propTypes.source,
    size: PropTypes.shape({
        height: PropTypes.number,
        width: PropTypes.number
    }),
    style: View.propTypes.style
}

VideoPlayer.defaultProps = {
    size: { height: rem(385), width: rem(680) }
}

const SS = StyleSheet.create({
    container: { backgroundColor: '#f8f8f8' },
    cover: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 },
    handleTouch: { flex: 1, backgroundColor: 'transparent' },
    handleBar: {
        height: rem(70), backgroundColor: 'rgba(55, 55, 55, 0.4)',
        flexDirection: 'row', alignItems: 'center', paddingHorizontal: rem(10)
    },
    slider: { flex: 1, marginHorizontal: rem(-10) },

    poster: { position: 'absolute', top: 0, left: 0 },

    loading: {
        position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: 'transparent'
    },

    mask: {
        position: 'absolute', top: 0, right: 0, bottom: 0, left: 0,
        justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent'
    },

    time: { fontSize: rem(24), color: '#fff', marginHorizontal: rem(10) }
})

const CT = {
    handleIconSize: rem(60),
    playIconSize: rem(120),
}
