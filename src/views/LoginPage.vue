<template>
    <div class="row g-0" style="min-height: 100vh;">
        <div class="pt-2 col-md-6 d-flex flex-column justify-content-center align-items-center"
            style="background: linear-gradient(113deg, #1FAB89 31%, #28CC9E 97%);">

            <router-link to="/" class=" rounded-circle d-flex justify-content-center"
                style="height: 150px; width: 150px; background: linear-gradient(113deg, #1FAB89 31%, #28CC9E 97%);">
                <img :src="`${publicPath}${logo}`" style="width: 100%; object-fit: contain;">
            </router-link>
            <div class="d-flex justify-content-center">
                <p class="mt-2 m-0 fw-bold icon">Fabricator</p>
            </div>
        </div>
        <div class="container d-flex flex-column justify-content-center col-md-6 bg-light pt-2">
            <p class="d-flex justify-content-center fs-5">Login Your Account </p>

            <form @submit.prevent="loginAccount()">
                <div class="w-100 p-2 form-floating">
                    <input type="email" class="form-control" id="floatingInput" placeholder="Email" v-model="email"
                        required>
                    <label for="floatingInput" class="text-muted">Enter your Email</label>
                </div>

                <div class="w-100 p-2 form-floating">
                    <input type="password" class="form-control" id="floatingInput2" placeholder="Password"
                        v-model="password" required>
                    <label for="floatingInput2" class="text-muted">Password</label>
                </div>

                <div class="d-flex justify-content-center align-items-center w-100 px-2 mt-2">
                    <button type="submit" class="btn text-white py-2 fs-5 w-100"
                        style="padding: 10px 12px !important;background: linear-gradient(113deg, #1FAB89 31%, #28CC9E 97%);">Submit</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            logo: "img/fablogo.png",
            publicPath: process.env.BASE_URL,
            email: "",
            password: "",
            users: null,
        };
    },
    methods: {
        loginAccount() {
            axios.post('https://server.wsgbrand.in/api/login', {
                email: this.email,
                password: this.password
            }).then((response) => {
                // console.log('data sent', response)
                const token = response.data.token;
                localStorage.setItem('token', token);
                // console.log('login succesful token stored', token)
            }).catch((error) => {
                alert('error', error)
            })
        }
    },
}
</script>

<style scoped>
.icon {
    /* font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif; */
    font-family: Arial, Helvetica, sans-serif;
    font-size: 2rem;
    color: white;
    /* background: -webkit-linear-gradient(113deg, #28CC9E 31%, #1FAB89 97%); */
    padding: 14px 12px;
    /* -webkit-text-fill-color: transparent; */
    background-clip: text;
}
</style>