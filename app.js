var app = new Vue({

    el: '#app',

    data: {
        branches: ['master'],
        currentBranch: 'master',

        users: [],
        repository: {
            name: ''
        },
        projects: [],
        checkedNames: [],
        startDate: ''
    },

    watch: {
        currentBranch: 'fetchData'
    },

    filters: {
        truncate: function (v) {
            var newline = v.indexOf('\n')
            return newline > 0 ? v.slice(0, newline) : v
        },
        formatDate: function (v) {
            return v.replace(/T|Z/g, ' ')
        }
    },

    methods: {
        fetchData: function () {
            vm = this
            date = (new Date(this.startDate).getTime()/1000)
            if (this.checkedNames.length > 0) {

                var data
                vm.users = []
                

                this.checkedNames.forEach(element => {

                    var person = {
                        fullName: '',
                        github: '',
                        name: '',
                        commits: '',
                        readme: ''
                    }


                    var userNameUrl = 'https://api.github.com/users/' + element + ''


                    var request = new XMLHttpRequest()
                    request.open('GET', userNameUrl)
                    request.setRequestHeader('Authorization', 'Basic Zm91cm55LmdAZnJlZS5mcjpmb3VybnkzNw==')
                    request.onload = function () {
                        data = JSON.parse(request.responseText)
                        person.fullName = data.name
                        person.github = data.html_url
                        person.name = element
                    }
                    request.send()



                    var apiURL = 'https://api.github.com/repos/' + element + '/' + this.repository.name + '/commits?since='+date+''
                    var xhr = new XMLHttpRequest()
                    var self = this
                    xhr.open('GET', apiURL + self.currentBranch)
                    xhr.setRequestHeader('Authorization', 'Basic Zm91cm55LmdAZnJlZS5mcjpmb3VybnkzNw==')
                    xhr.onload = function () {
                        data = JSON.parse(xhr.responseText)
                        person.commits = data
                        person.readme = data[0].html_url
                    }
                    xhr.send()
                    vm.users.push(person)
                    
                })
            }
        }
    },

    created() {
        fetch("https://api.github.com/search/repositories?q=github-ynov-vue", {
            headers: {
                "Authorization": "Basic Zm91cm55LmdAZnJlZS5mcjpmb3VybnkzNw=="
            },
            method: "GET"
        })
            .then(response => response.json())
            .then((data) => {
                this.projects = data.items
            })
    },
})