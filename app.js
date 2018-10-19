$(function () {
    $('input[name="datefilter"]').daterangepicker({
        autoUpdateInput: false,
        locale: {
            cancelLabel: 'Clear'
        }
    });

    $('input[name="datefilter"]').on('apply.daterangepicker', function (ev, picker) {
        $(this).val(picker.startDate.format('DD/MM/YYYY') + ' - ' + picker.endDate.format('DD/MM/YYYY'));
    });

    $('input[name="datefilter"]').on('cancel.daterangepicker', function (ev, picker) {
        $(this).val('');
    });
});

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
        checkedNames: []
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
            if (this.checkedNames.length > 0) {

                var data
                vm.users = []

                this.checkedNames.forEach(element => {

                    var person = {
                        fullName: '',
                        github: '',
                        name: '',
                        commits: '',
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



                    var apiURL = 'https://api.github.com/repos/' + element + '/' + this.repository.name + '/commits?per_page=3&sha='
                    var xhr = new XMLHttpRequest()
                    var self = this
                    xhr.open('GET', apiURL + self.currentBranch)
                    xhr.setRequestHeader('Authorization', 'Basic Zm91cm55LmdAZnJlZS5mcjpmb3VybnkzNw==')
                    xhr.onload = function () {
                        person.commits = JSON.parse(xhr.responseText)
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