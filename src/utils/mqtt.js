import * as mqtt from "mqtt/dist/mqtt.min"

var uuid = Date.now() + Math.random().toString(36).substring(2, 4);
function getUUID() {
    return uuid;
}

const url = "http://" + "192.168.0.250" + ':9001'
const options = {
    // Clean session
    clean: true,
    connectTimeout: 40000,
    // 认证信息
    clientId: 'emqx_test' + getUUID(),
    username: 'acematic',
    password: 'ACEMATIC2018_',
}

class MyMqtt {
    constructor() {
        this.client = null
        

        // this.client.on("message", (topic, message) => {
        //     const d = JSON.parse(message.toString())
        //     this.onMessage = d
        // })
    }

    connect() {
        this.client = mqtt.connect(url, options)
        this.client.on("connect", () => {
            console.log("connect");
            this.isConnected = true
            this.client.subscribe("/client/" + getUUID(), function (err) {
                if (!err) console.log("subscribe client");
            })
            this.client.subscribe("/clients", function (err) {
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
    }

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
    }

    message(d) {
        return new Promise((resolve, reject) => {
            this.client.on("message", (topic, message) => {
                const d = JSON.parse(message.toString())
                resolve(d)
            })
        })
    }
}


export default new MyMqtt()