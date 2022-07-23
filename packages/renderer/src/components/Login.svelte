<script>
import * as axios from 'axios';
let credentials, name1, name2, auth1, auth2, selectedUser = 0, avatar;

const refillData = async () => {
    let UUID;
    credentials = localStorage.getItem('credentials');
    auth1 = localStorage.getItem('auth1');
    auth2 = localStorage.getItem('auth2');
    if (credentials != null) {
        if (credentials === auth1) {
            selectedUser = 1;
            UUID = JSON.parse(auth1).profile.id
        } else if (credentials === auth2) {
            selectedUser = 2;
            UUID = JSON.parse(auth2).profile.id
        } else {
            selectedUser = 0;
            UUID = undefined;
        }
    } else {
        selectedUser = 0;
        UUID = undefined;
    }
    if (auth1 != null) {
        console.log(auth1)
        name1 = JSON.parse(auth1).profile.name;
    }
    if (auth2 != null) {
        name2 = JSON.parse(auth2).profile.name;
    }
    if (UUID) {
        axios.get(`https://playerdb.co/api/player/minecraft/uuid/${UUID}`)
        .then((out) => {response = out.data.player;});
        avatar = response.avatar;
    } else {
        avatar = "https://crafatar.com/avatars/d479b9f8-f8f8-4f8e-b8f8-f8f8f8f8f8f8";
    }
};

const login = async (userID) => {
    let logDat
    await window.api.login()
    .then((loginData) => {
        logDat = loginData;
        if (loginData == auth1) {
            localStorage.setItem('credentials', auth1);
            selectedUser = 1;
        } else if (loginData == auth2) {
            localStorage.setItem('credentials', auth2);
            selectedUser = 2;
        } else {
            localStorage.setItem('credentials', loginData);
            localStorage.setItem(`auth${userID}`, loginData);
        }
    });
    refillData();
}

const logout = async (userID) => {
    localStorage.setItem(`auth${userID}`, undefined)
    refillData();
}

refillData()
</script>

<main>
    <div class="loginBox clearfix">
        <img class="avatar" src={avatar} alt="Default Skin URL"/>
        
        <button class="launch" on:click={ async () => { await login(1) }}>
            {name1}
            <button on:click={ async () => { await logout(1) }}>
            [X]
            </button>
        </button> <br>
    
        <button class="launch" on:click={ async () => { await login(2) }}>
            {name2}
            <button on:click={ async () => { await logout(2) }}>
            [X]
            </button>
        </button> <br>
    </div>
</main>

<style>
img.avatar {
    display: block; 
    height: 100px; 
    float: left;
}
</style>