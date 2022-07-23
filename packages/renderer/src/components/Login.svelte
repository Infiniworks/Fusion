<script>
import * as nconf from "nconf"; 

async function setUsername(id, loginName) {
    let data;
    await window.api.login()
    .then((loginData) => {
        console.log(loginData);
        data = loginData
    })
    loginName = data.profile.name;

    let users = JSON.parse(localStorage.getItem("users"));

    _.extend(users, JSON.parse(`{${loginName}: ${data}}`));
    console.log(users)


    // users.forEach(function(value, index, array) {
    //     if (array[index].profile.name === loginName) {
    //         array[index] = data;
    //         return;
    //     }
    // });
}

let users = JSON.parse(localStorage.getItem("users"));

const login = async () => {
    
}

</script>

<main>
    <button on:click={
        async () => {
            await login()
        }
    }>Login</button>
</main>

<style>

</style>