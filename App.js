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
            source: { uri: 'http://test-img.3dker.cn//5731ee9c0861fd700421991d30aa88cb' },

            value: 0,
        }
    }
    componentWillMount() {
        this.setState({ value: 1 })
        console.log('componentWillMount_1', this.state.value)
        this.setState({ value: 2 })
        console.log('componentWillMount_2', this.state.value)
    }
    componentDidMount() {
        // this.setState({ value: 3 })
        // console.log('componentDidMount_3', this.state.value)
        // this.setState({ value: 4 })
        // console.log('componentDidMount_4', this.state.value)


        setTimeout(() => {
            this.setState({ value: 5 })
            console.log('setTimeout_5', this.state.value)
            this.setState({ value: 6 })
            console.log('setTimeout_6', this.state.value)
        })
    }
    render() {
        return (
            <View style={ SS.container }>
                <Text>frwgrewgerge</Text>
                {/*<VideoPlayer source={ this.state.source } poster={ require('./src/assets/poster.png') }/>*/}
            </View>
        )
    }
}

const SS = StyleSheet.create({
    container: { flex: 1,  backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
})
