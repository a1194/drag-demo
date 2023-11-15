import { defineStore } from "pinia"
import * as mqtt from "mqtt/dist/mqtt.min"

var uuid = Date.now() + Math.random().toString(36).substring(2, 4);
function getUUID() {
    return uuid;
}

const useMqttStore = defineStore("mqttStore", {
    state() {
        return {
            client: null,

            sortUi: {},
            currentType: 'favor',

            areas: [],
            rooms: [],
            devices: [],
            combineScenes: [],
            sorts: [],
            favorites: [],

            activeState: [],
            

            showDrawer: false,
            drawerData: null
        }
    },
    actions: {
        connect() {
            // const url = "http://" + window.location.host + ':9001'
            const url = "http://" + "192.168.1.250" + ':9001'
            const options = {
                // Clean session
                clean: false,
                // 认证信息
                clientId: 'emqx_test' + getUUID(),
                username: 'acematic',
                password: 'ACEMATIC2018_',
            }

            this.client = mqtt.connect(url, options)
            this.client.on("connect", () => {
                console.log("connect");
                this.client.subscribe("/client/" + getUUID(), (err) => {
                    this.isConnected = true
                    if (!err) console.log("subscribe client");
                        //发送请求
                        this.publish("getAreas", {})
                        this.publish("getRooms", {})
                        this.publish("getDevices", {})
                        this.publish("getCombineScenes", {})
                        this.publish("getSorts", {})
                        this.publish("getActiveSortUi", { sort_id: 1 })
                        this.publish("getStates", {})
                })
                this.client.subscribe("/clients", (err) => {
                    if (!err) console.log("subscribe clients");
                })
            })
            this.client.on("close", () => {
                console.log("close");
                this.isConnected = false
            })

            this.client.on('error', function (error) {
                console.log(error)
            })


            this.client.on("message", (topic, message) => {
                const d = JSON.parse(message.toString())
                console.log(d);
                if(d.method == 'getAreasCb') {
                    this.areas = d.payload.data
                }
                if(d.method == 'getRoomsCb') {
                    this.rooms = d.payload.data
                }
                if(d.method == 'getDevicesCb') {
                    this.devices = d.payload.data.filter(item => item.sort_id != 1)
                    this.publish("getStates", {})
                }
                if(d.method == 'getCombineScenesCb') {
                    this.combineScenes = d.payload.data
                }
                if(d.method == 'getSortsCb') {
                    if(d.payload.index == 1) {
                        this.sorts = []
                    }
                    if(d.payload.index != d.payload.total) {
                        this.sorts.push(...d.payload.data)
                    }
                }
                if(d.method == 'getActiveSortUiCb') {
                    this.sortUi = d.payload
                    this.favorites = d.payload.pages[0].favorites
                }
                if(d.method == 'getStatesCb') {
                    this.activeState = d.payload.data
                }
                if(d.method == 'onState') {
                    if(d.payload.state == 1) {
                        //发送请求
                        this.publish("getAreas", {})
                        this.publish("getRooms", {})
                        this.publish("getDevices", {})
                        this.publish("getCombineScenes", {})
                        this.publish("getSorts", {})
                        this.publish("getActiveSortUi", { sort_id: 1 })
                        this.publish("getStates", {})
                    }
                }
                if(d.method == 'deviceStateCb') {
                    this.publish("getStates", {})
                }
            })
        },
        publish(method, payload) {
            const data = {
                client_id: getUUID(),
                method,
                payload
            }
            console.log(JSON.stringify(data));
            this.client.publish("/host", JSON.stringify(data), err => {
                if(err) console.log(err);
            })

        },
        // message() {
        //     return new Promise((resolve) => {
        //         this.client.on("message", (topic, message) => {
        //             const d = JSON.parse(message.toString())
        //             if(d.method == this.payload + 'Cb') {
        //                 resolve(d)
                        
        //             }
        //         })
        //     })
        // }
    }
})

export default useMqttStore