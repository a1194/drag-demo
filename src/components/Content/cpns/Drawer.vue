<script setup>
import { ref, onMounted, onUnmounted, getCurrentInstance, watch, toRaw, computed } from "vue"
import useMqttStore from "@/store/mqtt";
import { getPath } from "@/utils";
import MySlider from "./MySlider.vue";

const instance = getCurrentInstance()
const mqttStore = useMqttStore()

const moreData = ref()
const props = defineProps({
    drawerData: Object,
})

mqttStore.publish("getStates", {})
watch(() => mqttStore.activeState, (activeState) => {
    const findItem = activeState.find(item => item.sn == props.drawerData.sn)
    
    findItem.states.forEach((item, index) => {
        if(item.service == 'mode' || item.service == 'fan') {
            console.log(item);
        }
    })
    moreData.value = findItem
})

// instance.proxy.$Bus.on("changeControl", () => {
//     const findItem = mqttStore.activeState.find(item => item.sn == props.drawerData.sn)
//     console.log(findItem);
//     moreData.value = findItem
// })




function handleBlur(e) {
    if (e.target.className == 'outter') {
        instance.proxy.$Bus.emit("closeDrawer")
    }
}
onMounted(() => {
    document.addEventListener('click', handleBlur)
})

onUnmounted(() => {
    document.removeEventListener('click', handleBlur)
})

const path = computed(() => getPath())

function handleBackClick() {
    instance.proxy.$Bus.emit("closeDrawer")
}

function handleSwitchClick(item, index) {
    if(item.msg.hasOwnProperty('on')) {
        item.msg = { off: 0 }
        
    } else {
        item.msg = { on: 1 }
    }
    const obj = {
        ...moreData.value,
        ...toRaw(item)
    }
    delete obj.states
    console.log(obj);
    mqttStore.publish("deviceControl", obj)
    mqttStore.publish("getStates", {})
}

function handlebrightnessChange(item, value) {
    item.msg = { percent: Number(value) }
    const obj = {
        ...moreData.value,
        ...toRaw(item)
    }
    delete obj.states
    console.log(obj);
    mqttStore.publish("deviceControl", obj)
    mqttStore.publish("getStates", {})
}

const tempratureDown = ref(false)
const temperatureUp = ref(false)

function handleTempratureDown() {}
function handleTempratureUp() {}
</script>

<template>
    <div class="outter" >
        <div class="drawerContent" >
            <div>
                <div class="header">
                    <div class="left" @click.stop="handleBackClick">
                        <div class="back"><img :src="path + 'left_arrow_normal.png'" alt="" srcset=""></div>
                        <div class="name">{{ drawerData.name }}</div>
                    </div>
                    <div class="right">
                        <div class="more"><img :src="path + 'ic_more.png'" alt="" srcset=""></div>
                    </div>
                </div>
                <div class="content">
                    <img :src="path + 'chs_air_control_background.png'" alt="" srcset="" v-if="moreData?.sort_id == 1005 || moreData?.sort_id == 2007">
                    <img :src="path + 'chs_dimmer_switch_lamp_background.png'" alt="" srcset="" >
                    <div class="control">
                        <template v-for="(item, index) in moreData?.states">
                            <div class="controlItem switch" v-if="item.service == 'switch'" @click.stop="handleSwitchClick(item, index)">
                                <div class="state swiitchItem">{{ item.msg?.on ? '已开启' : '已关闭' }}</div>
                                <div class="middle swiitchItem" v-if="moreData?.sort_id == 1005 || moreData?.sort_id == 2007"></div>
                                <div class="icon swiitchItem" >
                                    <img :src="path + 'chs_control_switch_on.png'" alt="" srcset="" v-if="item.msg?.on" style="width: auto; height: auto;">
                                    <img :src="path + 'chs_control_switch_off.png'" alt="" srcset=""  v-else style="width: auto; height: auto;">
                                </div>
                            </div>
                            <div class=" brightness" v-if="item.service == 'brightness'">
                                <MySlider width="100%" :value="item.msg.percent" :text="item.service" @getValue="handlebrightnessChange(item, $event)"></MySlider>
                            </div>
                            <div class="controlItem setTemperature" v-if="item.service == 'setTemperature'">
                                <div class="left tempratureItem" @mousedown="tempratureDown = true" @mouseup="tempratureDown = false" @click="handleTempratureDown">
                                    <img :src="path + 'chs_temperature_minus_selected.png'" alt="" srcset="" class="temImage" v-if="tempratureDown">
                                    <img :src="path + 'chs_temperature_minus_normal.png'" alt="" srcset="" class="temImage" v-else>
                                </div>
                                <div class="middle tempratureItem">
                                    {{ item.msg.temperature }}
                                </div>
                                <div class="right tempratureItem" @mousedown="temperatureUp = true" @mouseup="temperatureUp = false" @click="handleTempratureUp">
                                    <img :src="path + 'chs_temperature_plus_pressed.png'" alt="" srcset="" class="temImage" v-if="temperatureUp">
                                    <img :src="path + 'chs_temperature_plus_normal.png'" alt="" srcset="" class="temImage" v-else>
                                </div>
                            </div>
                            <div class="controlItem mode" v-if="item.service == 'mode'">
                                {{ item }}
                            </div>
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
.outter {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 9999;
}
.drawerContent {
    position: fixed;
    right: 0px;
    top: 300px;
    width: 650px;
    height: 750px;
    background-color: rgba(255, 255, 255, .5);
    backdrop-filter: blur(4px);
    overflow: hidden;
    padding: 30px;
    box-sizing: border-box;
    user-select: none;
    border-radius: 12px;
    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 65px;
        .left {
            display: flex;
            align-items: center;
            flex-wrap: nowrap;
            .back {
                width: 35px;
                height: 35px;
                margin-right: 10px;
            }
            .name {
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
                width: 250px;
            }
        }
        .right {
            width: 35px;
            height: 35px;
        }
    }
    .content {
        position: relative;
        width: 100%;
        height: 630px;
        border-radius: 8px;
        overflow: hidden;
        .control {
            display: flex;
            flex-direction: column;
            align-items: center;
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            // height: 70px;
            padding: 10px 0;
            background-color: #000;
            border-radius: 8px;
            overflow: hidden;
            .controlItem {
                display: flex;
                margin: 10px 0;
                height: 72px;
                width: 73%;
                // padding: 0px 20px;
                border-radius: 30px;
                
                box-sizing: border-box;
                .middle {
                    margin: 0 1px;
                }
            }
            .switch {
                display: flex;
                justify-content: space-between;
                .swiitchItem {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 100%;
                    // flex-grow: 1;
                    background-color: rgba(88, 88, 88, 0.37);
                    &:nth-child(1) {
                        border-top-left-radius: 30px;
                        border-bottom-left-radius: 30px;
                    }
                    &:nth-last-child(1) {
                        border-top-right-radius: 30px;
                        border-bottom-right-radius: 30px;
                    }
                }
            }
            
            .brightness {
                width: 73%;
                margin: 10px 0;
            }
            .setTemperature {
                display: flex;
                justify-content: space-between;
                
                .tempratureItem {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 100%;
                    background-color: rgba(88, 88, 88, 0.37);
                    &:nth-child(1) {
                        border-top-left-radius: 30px;
                        border-bottom-left-radius: 30px;
                    }
                    &:nth-last-child(1) {
                        border-top-right-radius: 30px;
                        border-bottom-right-radius: 30px;
                    }
                    .temImage {
                        width: 35px;
                        height: 35px;
                    }
                }
            }
        }
    }
}
</style>