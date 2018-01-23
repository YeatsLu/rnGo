import { Dimensions } from "react-native"

const defaultWidth = 750// 设计稿宽度
export const deviceWidth = Dimensions.get("window").width // 设备宽度

console.log('deviceWidth', deviceWidth)

// dp to designer px
export function dp2px(dp) {
    return Math.round(dp * deviceWidth / defaultWidth)
}