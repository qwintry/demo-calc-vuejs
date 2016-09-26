(function (exports) {

    'use strict';

    var api_key = '9e4fddbb3adc4c67f74bb2b7757cebf9'
    var path = {
        'products' : 'products.json',
        'countries' : 'countries.json',
        'api': 'https://qwintry.com/ru/api-rest/v2/calculator'
    }

    exports.app = new Vue({
        el: '#app',
        data: {
            title: 'Test',
            products: null,
            countries: null,
            request: null,
            errors: null,
            results: null,
            calc: {
                weight: null,
                country: null,
                cost: null,
                help: false,
                insurance: false,
            }
        },

        created: function () {
            this.fetch_products()
            this.fetch_countries()
        },

        methods: {
            calculate: function (product) {

                if(product.name) {
                  this.calc.weight = product.weight
                  this.calc.cost = product.price
                }

                this.request = true
                this.results = null

                this.$http.post(path.api, {
                    'key': api_key,
                    'weight': this.calc.weight,
                    'weight_type': 'kg',
                    'insurance_type': this.calc.insurance ? 'gg' : 'no',
                    'declaration_total': this.calc.cost,
                    'country': this.calc.country,
                    'shophelp': this.calc.help ? 1 : 0,
                    'shophelp_safe_addr': true
                },
                {
                    emulateJSON: true,
                    headers: {
                        "content-type": "application/x-www-form-urlencoded; charset=UTF-8"
                    }
                }).then(function (response) {
                    this.errors = false
                    this.request = false
                    this.$set('results', response.body.data)
                }, function (response) {
                    this.request = false
                    this.$set('errors', response.body.errors)
                });


                return false
            },
            fetch_products: function () {
                this.$http.get(path.products).then(function (response) {
                    this.$set('products', response.body);
                }, function (response) {
                    console.log(response)
                });
            },
            fetch_countries: function () {
                this.$http.get(path.countries).then(function (response) {
                    this.$set('countries', response.body);
                }, function (response) {
                    console.log(response)
                });
            }
        }
    })


})(window);