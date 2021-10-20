<template>
  <div :id="container_id"></div>
</template>

<script>
    export default {
        name: 'TradingView',
        props: {
            options: {
                default: {
                    symbol: 'BINANCE:ETHUSDT',
                    theme: 'dark',
                    autosize: true,
                    allow_symbol_change: false,
                    withdateranges: true,
                    hide_side_toolbar: false,
                    details: true,
                    show_popup_button: true,
                    studies: [
                        'BB@tv-basicstudies',
                        'MACD@tv-basicstudies'
                    ]
                }
            }
        },
        data() {
            return {
                container_id: 'trading-view',
                script_id: 'tradingview-widget-script'
            };
        },

        methods: {
            canUseDOM() {
                return typeof window !== 'undefined' && window.document && window.document.createElement;
            },
            getScriptElement() {
                return document.getElementById(this.script_id);
            },
            updateOnloadListener(onload) {
                let script = this.getScriptElement();
                let oldOnload = script.onload;

                return script.onload = () => {
                    oldOnload();
                    onload();
                };
            },
            scriptExists() {
                return this.getScriptElement() !== null;
            },
            appendScript(onload) {
                if (!this.canUseDOM()) {
                    onload();
                    return;
                }
                if (this.scriptExists()) {
                    if (typeof TradingView === 'undefined') {
                        this.updateOnloadListener(onload);
                        return;
                    }
                    onload();
                    return;
                }

                let script = document.createElement('script');

                script.id = this.script_id;
                script.type = 'text/javascript';
                script.async = true;
                script.src = 'https://s3.tradingview.com/tv.js';
                script.onload = onload;

                document.getElementsByTagName('head')[0].appendChild(script);
            },
            initWidget() {
                if (typeof TradingView === 'undefined') {
                    return;
                }
                new window.TradingView.widget(
                    Object.assign({ container_id: this.container_id }, this.options)
                );
            },
        },
        mounted() {
            this.appendScript(this.initWidget);
        },
    }
</script>