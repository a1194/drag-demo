<script setup>
import MyHeader from "@/components/Header/MyHeader.vue"
import MyContent from "@/components/Content/MyContent.vue"
import { getPath } from "@/utils/index"
import { onUnmounted } from "vue"

import useMqttStore from "@/store/mqtt.js"
const mqttStore = useMqttStore()
mqttStore.connect()

// mqttStore.publish("editSortUi", {"id":50003,"sort_id":1,"pages":[{"title": "Acematic的家","style":{ "obj": {}, "css":{} },"services": [],"parts": [],"favorites":[]}],"state":1,"name":"中控屏（默认）"})

// mqttStore.publish("getActiveSortUi", {sort_id: 1})

onUnmounted(() => {
    mqttStore.client.end()
})
</script>


<template>
    <div class="app" :style="{background: `url('${getPath()}home_ace_background.png')`}">
        <MyHeader class="header"></MyHeader>
        <MyContent class="content"></MyContent>
    </div>
</template>

<style lang="less" scoped>
    .app {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100vh;
        padding: 20px 26px;
        box-sizing: border-box;
        // background: url("http://192.168.0.250/files/assets/images/home_ace_background.png") no-repeat ;
        background-repeat: no-repeat !important;
        background-position: 100% 100% !important;
        // background-attachment: fixed;
        background-size: cover !important;
        .header {
            min-height: 250px;
        }
        .content {
            flex-grow: 1;
            overflow-y: auto;
            width: 100%;
            &::-webkit-scrollbar {
                display: none;
            }
            // overflow-x: hidden;
        }
    }
</style>