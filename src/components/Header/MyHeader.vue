<script setup>
import useMqttStore from "@/store/mqtt";

const mqttStore = useMqttStore()

import Tabs from "./cpns/Tabs.vue"
import { formatTime, getPath } from "@/utils/index.js"
import { ref } from "vue"



const nowTime = ref(formatTime())
setInterval(() => {
    nowTime.value = formatTime()
}, 36000)
</script>

<template>
    <div class="header">
        <div class="nav">
            <div class="time">{{ nowTime }}</div>
        </div>
        <div class="title">
            <div class="name">Acematic 的家</div>
            <div class="arrow">
                <img :src="getPath() + 'chs_personal_white_right_arrow.png'" alt="" srcset="">
            </div>
            <div class="add">+</div>
        </div>
        <div class="tabs">
            <Tabs></Tabs>
        </div>
    </div>
</template>

<style lang="less" scoped>
    .nav {
        height: 50px;
        .time {
            font-size: 22px;
        }
    }
    .title {
        display: flex;
        align-items: center;
        margin: 12px 0;
        .name {
            font-size: 45px;
            font-weight: bold;
        }
        .arrow, .add {
            width: 35px;
            height: 35px;
            margin: 0 20px;
        }
    }
</style>