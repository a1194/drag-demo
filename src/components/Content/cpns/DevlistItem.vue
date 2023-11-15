<script setup>
import useMqttStore from '@/store/mqtt';
import { getPath } from '@/utils';
import { ref, computed, onMounted, getCurrentInstance, watch, toRaw } from "vue"

// const instance = getCurrentInstance()
let instance

const isClick = ref(false)


const mqttStore = useMqttStore()
const props = defineProps({
    data: Object,
    type: Number,
    isFav: Boolean,
    dev_type: Number,
    pos: Object
})
instance = getCurrentInstance()
// const isStar = ref(false)
// watch(() => mqttStore.sortUi, (newSortUi) => {
//     console.log(23);
//     isStar.value = newSortUi.pages[0]?.favorites.find(item => (item.type == props.type) && (item.id == props.data.dev_id || item.id == props.data.scene_id)) ? true : false
// })
const isStar = computed(() => {

    return mqttStore.sortUi?.pages[0]?.favorites.find(item => (item.type == props.type) && (item.id == props.data.dev_id || item.id == props.data.scene_id))
    
})

function handleFavor() {
    if(isStar.value) {
        
        mqttStore.sortUi?.pages[0]?.favorites.splice(mqttStore.sortUi.pages[0].favorites.findIndex(itemy => (itemy.type == props.type) && ((itemy.id == props.data.dev_id) || (itemy.id == props.data.scene_id))), 1)
        
    } else {
        const obj = { type: props.type }
        obj.id =  props.data.dev_id || props.data.scene_id
        obj.w = 4
        obj.h = 3
        
        mqttStore.sortUi?.pages[0].favorites.unshift(obj)
        
    }   
    mqttStore.publish("editSortUi", mqttStore.sortUi)
    if(props.isFav) {
        mqttStore.publish("getActiveSortUi", {sort_id: 1})
    }

    
}

function handleIconClick() {
    const findItem = mqttStore.activeState.find(item => item.sn == props.data.sn)
    if(!findItem) return
    if(findItem.states[0].msg.hasOwnProperty('on')) {
        findItem.states[0].msg = { off: 0 }
    } else {
        findItem.states[0].msg = { on: 1 }
    }
    const obj = {
        ...toRaw(findItem),
        ...toRaw(findItem.states[0])
    }
    delete obj.states
    mqttStore.publish("deviceControl", obj)
    mqttStore.publish("getStates", {})
    // mqttStore.publish("getActiveSortUi", { sort_id: 1 })
    // instance.proxy.$Bus.emit("changeControl")
}

const isMoreClick = ref(false)
function handleMoreClick() {
    isMoreClick.value = !isMoreClick.value
    // console.log(instance.proxy.$Bus);
    // let findItem
    if(props.type == 1 && isMoreClick.value) {
        // findItem = mqttStore.activeState.find(item => item.sort_id == props.data.sort_id)
        instance.proxy.$Bus.emit("showDrawer", props.data)
    } else {
        instance.proxy.$Bus.emit("closeDrawer")
    }
    
}

instance.proxy.$Bus.on("closeDrawer", () => {
    isMoreClick.value = false
})

watch([() => mqttStore.activeState, () => props.data], ([newState, newData]) => {
    
    isClick.value = newState.find(item => item.sn == newData.sn)?.states[0].msg?.on ? true : false
    
}, {immediate: true})


const path = computed(() => getPath())
</script> 
<template>
    <div class="devlistitem" @click="handleIconClick" :style="pos">
        <div class="top">
            <div class="icon" >
                <template v-if="dev_type == 2 || dev_type == 3 || dev_type == 4">
                    <img  :src="path + 'device_light_icon.png'" alt="" srcset="" v-if="!isClick">
                    <img  :src="path + 'device_light_icon_selected.png'" alt="" srcset="" v-else>
                </template>
                <template v-else-if="dev_type == 6">
                    <img  :src="path + 'device_air_icon.png'" alt="" srcset="" v-if="!isClick">
                    <img  :src="path + 'device_air_icon_selected.png'" alt="" srcset="" v-else>
                </template>
                <template v-else>
                    <img  :src="path + 'chs_default_scene_icon.png'" alt="" srcset="" v-if="!isClick">
                    <img  :src="path + 'chs_default_scene_icon_selected.png'" alt="" srcset="" v-else>
                </template>
            </div>
            <div class="star" @click.stop="handleFavor">
                <img v-if="isStar" :src="path + 'star_selected.png'" alt="" srcset="">
                <img v-else :src="path + 'star_normal.png'" alt="" srcset="">
            </div>
        </div>
        <div>
            <div class="name">{{ data.name }}</div>
            <div class="room">{{ data.roomName }}</div>
        </div>
        <div class="more" @click.stop="handleMoreClick">
            <img :src="path + 'chs_more_selected.png'" alt="" srcset="" v-if="isMoreClick">
            <img :src="path + 'chs_more_normal.png'" alt="" srcset="" v-else>
        </div>
    </div>
</template>

<style lang="less" scoped>
    .devlistitem {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        position: relative;
        padding: 13px;
        // width: 320px;
        border: 1px solid #777;
        background-color: rgba(255, 255, 255, .2);
        border-radius: 8px;
        box-sizing: border-box;
        .top {
            display: flex;
            align-items: start;
            justify-content: space-between;
            margin-bottom: 60px;
            .icon {
                width: 80px;
                height: 80px;
            }
            .star {
                width: 50px;
                height: 50px;
            }
        }
        .name {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            width: 80%;
            margin-bottom: 12px;
        }
        .room {
            // font-size: 16px;
            color: #aaa;
        }
        .more {
            position: absolute;
            right: 5px;
            bottom: 5px;
            width: 50px;
            height: 50px;
        }
    }
    
</style>