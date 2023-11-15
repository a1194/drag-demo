<script setup>
import DevlistItem from "./DevlistItem.vue";
import useMqttStore from "@/store/mqtt";
import { ref, watch, toRaw } from "vue"
import { getDevTypeText } from "@/utils/config"

const mqttStore = useMqttStore()
const showData = ref([])

const props = defineProps({
    roomId: Number
})

watch([() => mqttStore.combineScenes, () => mqttStore.devices], () => {
    if (mqttStore.currentType != 'room') return
    showData.value = []
    let { devices, combineScenes, sorts, rooms } = mqttStore
    const newDevlist = devices.filter(item => item.room_id == props.roomId)
    const combiseArr = combineScenes.filter(item => item.room_id == props.roomId)
    combiseArr.forEach(item => {
        item.roomName = rooms.find(itema => itema.room_id == item.room_id).name
    })

    newDevlist.forEach((item => {
        const findItem = sorts.find(itemy => itemy.sort_id == item.sort_id)
        if (findItem) {
            const dataItem = showData.value.find(itemz => itemz.dev_type == findItem.dev_type)
            item.roomName = rooms.find(itema => itema.room_id == item.room_id).name
            if (!dataItem) {
                showData.value.push({
                    type: 1,
                    dev_type: findItem.dev_type,
                    dev_type_text: getDevTypeText(Number(findItem.dev_type)),
                    arr: [toRaw(item)]
                })
            } else {
                dataItem.arr.push(toRaw(item))
            }
        }
    }))

    if (combiseArr.length) {
        showData.value.unshift({
            type: 2,
            dev_type_text: "场景",
            arr: toRaw(combiseArr)
        })
    }
    console.log(showData.value);
})
</script>

<template>
    <div class="room">
        <template v-for="(item, index) in showData" :key="index">
            <div class="devType">
                <div class="devTypeName">{{ item.dev_type_text }}</div>
                <div class="devContent">
                    <template v-for="(itemy, indexy) in item.arr" :key="indexy">
                        <DevlistItem :data="itemy" class="item"  :type="item.type"
                            :dev_type="item.dev_type"></DevlistItem>
                    </template>
                </div>
            </div>

        </template>
    </div>
</template>

<style lang="less" scoped>
.devType {
    .devTypeName {
        margin-bottom: 22px;
    }

    .devContent {
        display: flex;
        flex-wrap: wrap;
    }
}

.item {
    width: 320px;
    margin-right: 30px;
    margin-bottom: 22px;
}
</style>