<script setup>
import { ref, getCurrentInstance, computed, watch, toRaw, onMounted, onUnmounted  } from "vue"
import useMqttStore from "@/store/mqtt";

import MyFavorites from "./cpns/MyFavorites.vue";
// import MyFavorites2 from "./cpns/MyFavorites2.vue";
import MyCombinescenes from "./cpns/MyCombinescenes.vue";
import MyRoom from "./cpns/MyRoom.vue";
import Drawer from "./cpns/Drawer.vue"

const mqttStore = useMqttStore()
const currentRoomId = ref()
const instance = getCurrentInstance()


const tabName = ref()
//点击tab
instance.proxy.$Bus.on("tabClick", (data) => {
    if (data.room_id > 0) {
        mqttStore.currentType = "room"
        mqttStore.publish("getCombineScenes", {})
        mqttStore.publish("getDevices", {})
        // mqttStore.publish("getSorts", {})
    } else if (data.room_id == -2) {
        mqttStore.currentType = "favor"
        mqttStore.publish("getActiveSortUi", { sort_id: 1 })
    } else if (data.room_id == -1) {
        mqttStore.currentType = "combineScenes"
        mqttStore.publish("getCombineScenes", {})
    }

    if (data.room_id != currentRoomId.value) {
        currentRoomId.value = data.room_id
    }
})
instance.proxy.$Bus.on("changeArea", () => {
    mqttStore.currentType = "favor"
    mqttStore.publish("getActiveSortUi", { sort_id: 1 })
})







const showDrawer = ref(false)
const drawerdata = ref()
instance.proxy.$Bus.on("showDrawer", (drawerData) => {
    showDrawer.value = !showDrawer.value
    drawerdata.value = drawerData
})
instance.proxy.$Bus.on("closeDrawer", () => {
    showDrawer.value = false
})






</script>

<template>
    <div class="content">
        <Transition name="fade">
            <Drawer :drawerData="drawerdata" v-if="showDrawer"></Drawer>
        </Transition>

        <div class="favor" v-show="mqttStore.currentType  == 'favor'">
            <MyFavorites ></MyFavorites>
            <!-- <MyFavorites2></MyFavorites2> -->
        </div>

        <div class="combineScenes" v-show="mqttStore.currentType == 'combineScenes'">
            <MyCombinescenes></MyCombinescenes>
        </div>


        <div class="room" v-show="mqttStore.currentType  == 'room'">
            <MyRoom :roomId="currentRoomId"></MyRoom>
        </div>
        
    </div>
</template>

<style lang="less" scoped>
.content {

    .devType {
        .devTypeName {
            margin-bottom: 16px;
        }

        .devContent {
            display: flex;
            flex-wrap: wrap;
        }
    }

    .combineScenes {
        display: flex;
        flex-wrap: wrap;
    }

    .item {
        margin-right: 20px;
        margin-bottom: 16px;
    }
}

.fade-enter-active,
.fade-leave-active {
    transition: all 0.3s ease;
}

.fade-enter-from {
    transform: translateX(380px);
    opacity: 0;
}

.fade-leave-to {
    transform: translateX(380px);
    opacity: 0;
}</style>