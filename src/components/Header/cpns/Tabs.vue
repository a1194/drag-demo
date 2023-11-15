<script setup>
import { ref, computed, watch, toRefs } from "vue"
import useMqttStore from "@/store/mqtt";
import TabsDropdown from "./TabsDropdown.vue";
import { getCurrentInstance } from "vue"

const instance = getCurrentInstance()
const mqttStore = useMqttStore()

const newAreas = ref([
    {
        area_id: 0,
        name: "全屋"
    }
])
const newRooms = ref([
    {
        name: "收藏",
        area_id: -1,
        room_id: -2
    },
    {
        name: "场景",
        area_id: -1,
        room_id: -1
    }
])


const currentAreaId = ref(-1)
const currentIndex = ref(0)


watch(() => mqttStore.areas, (areas) => {
    newAreas.value = [
        {
            area_id: 0,
            name: "全屋"
        }
    ]
    newAreas.value = [...newAreas.value, ...areas]
    currentAreaId.value = newAreas.value[0].area_id
})
watch(() => mqttStore.rooms, (rooms) => {
    newRooms.value = [
        {
            name: "收藏",
            area_id: -1,
            room_id: -2
        },
        {
            name: "场景",
            area_id: -1,
            room_id: -1
        }
    ]
    newRooms.value = [...newRooms.value, ...rooms]
    console.log(rooms);
})




function handleChange(item) {
    console.log(item.area_id);
    currentIndex.value = 0
    currentAreaId.value = item.area_id

    //楼层改变的时候将tab变为收藏
    instance.proxy.$Bus.emit("changeArea")
}

//当前显示的导航栏
const currentTab = computed(() => {
    if (currentAreaId.value == 0) {
        return newRooms.value
    } else {
        return newRooms.value?.filter(item => item.area_id == currentAreaId.value || item.area_id == -1)
    }
})


function handleCurrentTabClick(item, index) {
    currentIndex.value = index
    instance.proxy.$Bus.emit("tabClick", item)
}
</script>

<template>
    <div class="tabs">
        <TabsDropdown :data="newAreas" @change="handleChange" class="dropdown"></TabsDropdown>
        <div class="rooms">
            <template v-for="(item, index) in currentTab">
                <div class="room" :style="{ color: currentIndex == index ? '#fff' : '#bbb' }"
                    @click="handleCurrentTabClick(item, index)">{{ item.name }}</div>
            </template>
        </div>
    </div>
</template>

<style lang="less" scoped>
.tabs {
    display: flex;
    align-items: center;
    font-size: 32px;
    // height: 35px;
    margin: 20px 0;

    .dropdown {
        margin-right: 30px;
    }

    .rooms {
        display: flex;
        align-items: center;

        .room {
            margin-right: 30px;
            color: #bbb;
        }
    }
}
</style>