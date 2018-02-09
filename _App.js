import * as React from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
    ImageBackground,
    Animated,
    StatusBar
} from 'react-native';
import { TabViewAnimated, TabBar } from 'react-native-tab-view'; // 0.0.74
import ContactsList from './src/common/ContactsList';

const initialLayout = {
    height: 0,
    width: Dimensions.get('window').width,
};

const HEADER_HEIGHT = 240;
const COLLAPSED_HEIGHT = 52 + StatusBar.currentHeight;
const SCROLLABLE_HEIGHT = HEADER_HEIGHT - COLLAPSED_HEIGHT;

export default class TabView extends React.Component {
    constructor(props: Props) {
        super(props);

        this.state = {
            index: 0,
            routes: [
                { key: '1', title: 'First' },
                { key: '2', title: 'Second' },
                { key: '3', title: 'Third' },
            ],
        };
        this.scroll =  new Animated.Value(0),

        this.scroll.addListener(v =>{
            console.log('scrolling', v)
        })
    }

    _handleIndexChange = index => {
        this.setState({ index });
    };

    _renderHeader = props => {
        const translateY = this.scroll.interpolate({
            inputRange: [0, SCROLLABLE_HEIGHT],
            outputRange: [0, -SCROLLABLE_HEIGHT],
            extrapolate: 'clamp',
        });

        return (
            <Animated.View style={[styles.header, { transform: [{ translateY }] }]}>
                <ImageBackground
                    source={{ uri: 'https://picsum.photos/900' }}
                    style={styles.cover}>
                    <View style={styles.overlay} />
                    <TabBar {...props} style={styles.tabbar} />
                </ImageBackground>
            </Animated.View>
        );
    };

    _renderScene = () => {
        return (
            <ContactsList
                scrollEventThrottle={1}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: this.scroll } } }],
                    { useNativeDriver: true }
                )}
                contentContainerStyle={{ paddingTop: HEADER_HEIGHT }}
            />
        );
    };

    render() {
        return (
            <TabViewAnimated
                style={styles.container}
                navigationState={this.state}
                renderScene={this._renderScene}
                renderHeader={this._renderHeader}
                onIndexChange={this._handleIndexChange}
                initialLayout={initialLayout}
            />
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, .32)',
    },
    cover: {
        height: HEADER_HEIGHT,
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1,
    },
    tabbar: {
        backgroundColor: 'rgba(0, 0, 0, .32)',
        elevation: 0,
        shadowOpacity: 0,
    },
});
