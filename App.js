import React, { Component } from 'react'
import { Text, View, Image, StyleSheet } from 'react-native'

import VideoPlayer from './src/common/videoPlayer'

export default class App extends Component {
    constructor(prop) {
        super(prop)

        this.state = {
            // source: require('./src/assets/luck.mp4'),
            source: { uri: 'https://test-img.3dker.cn/ec046854dc7cce3bfce31efacc112d22' },
            // source: { uri: 'https://test-img.3dker.cn/d7c2c75923f6d02e66aedbe8b179b5a2' },
            // source: { uri: 'https://test-img.3dker.cn/608a82b6b9ba9930cdfe8661b9a3a64f' }
        }
    }
    render() {
        return (
            <View style={ SS.container }>
                <VideoPlayer source={ this.state.source } poster={ require('./src/assets/poster.png') }/>
            </View>
        )
    }
}

const SS = StyleSheet.create({
    container: { flex: 1,  backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
})
