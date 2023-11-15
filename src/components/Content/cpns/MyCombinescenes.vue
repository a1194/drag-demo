<script setup>
import DevlistItem from "./DevlistItem.vue";
import useMqttStore from "@/store/mqtt";
import { ref, watch } from "vue"

const combineScenesDev = ref()
const mqttStore = useMqttStore()


watch(() => mqttStore.combineScenes, (newValue) => {
    if (mqttStore.currentType != 'combineScenes') return
    const { rooms } = mqttStore
    newValue.forEach(item => {
        item.roomName = rooms.find(itema => itema.room_id == item.room_id)?.name
    })
    combineScenesDev.value = newValue
})
</script>

<template>
    <div class="combinescenes">
        <template v-for="(item, index) in combineScenesDev">
            <DevlistItem :data="item" class="item" :type="2"></DevlistItem>
        </template>
    </div>
</template>

<style lang="less" scoped>
.combinescenes {
    display: flex;
    flex-wrap: wrap;
}

.item {
    width: 320px;
    margin-right: 30px;
    margin-bottom: 22px;
}
</style>