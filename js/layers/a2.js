addLayer("a2", {
    name: "α",
    symbol() {
        if(tmp.ac.unlocks>=4){
            if(player.a2.gamma.gte(1)){
                return "α/γ = "+format(player[this.layer].points,0)+'/'+format(player[this.layer].gamma,0)
            }
            if(player[this.layer].unlocked){
                return "α = "+format(player[this.layer].points,0)
            }
        }else{
            if(player.a2.gamma.gte(1)){
                return "α/β/γ = "+format(player[this.layer].points,0)+'/'+format(player[this.layer].beta,0)+'/'+format(player[this.layer].gamma,0)
            }
            if(player[this.layer].unlocked){
                return "α/β = "+format(player[this.layer].points,0)+'/'+format(player[this.layer].beta,0)
            }
        }
        return "α"
    },
    position: 0,
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        value: new Decimal(0),
        beta: new Decimal(0),
        valueBeta: new Decimal(0),
        gamma: n(0),
        valueGamma: new Decimal(0),
    }},
    nodeStyle: { "min-width": "60px", height: "60px", "font-size": "30px", "padding-left": "15px", "padding-right": "15px" },
    color: "#f8a9ba",
    resource: "阿尔法能量", 
    resourceEN: "Alpha Energy", 
    baseResource: "n", 
    baseAmount() {return player.a.value}, 
    type: "custom",
    tooltipLocked() { return "" },
    canReset() { return tmp[this.layer].getResetGain.gte(1) },
    getResetGain() {
        let amt = 0
        if(player.a.value.gte(player.a2.points.add(1))){amt = 1}
        if(tmp.ac.unlocks>=2){amt = player.a.value.sub(player.a2.points).max(0).floor().min(n(300).sub(player.a2.points))}

        return new Decimal(amt)
    },
    getNextAt() {
        if(tmp.ac.unlocks>=2){return player.a.value.sub(player.a2.points).max(0).floor().add(player.a2.points).add(1)}
        return player.a2.points.add(1)
    },
    prestigeButtonText() {
        let text = "重置以获得 "+"<b>"+formatWhole(tmp[this.layer].resetGain)+"</b> 阿尔法能量<br><br>";
        text += n(tmp[this.layer].getResetGain).add(player.a2.points).gte(300) ? '您无法获得更多阿尔法能量' : "需求: a(A) ≥ "+format(tmp[this.layer].getNextAt)
        return text;
    },
    prestigeButtonTextEN() {
        let text = "Reset for "+"<b>"+formatWhole(tmp[this.layer].resetGain)+"</b> Alpha Energy<br><br>";
        text += "Req: a(A) ≥ "+format(tmp[this.layer].getNextAt)
        return text;
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return tmp.goals.unlocks>=1},
    displayFormula() {
        let f = "α - β + 1";
        if(tmp.ac.unlocks>=4){
            f = "α + 1";
        }

        let f2 = colorText('( ','#bf8f8f')+' β + 1 '+colorText(' )<sup>α / 20 + 0.7</sup','#bf8f8f')

        let f3 = '1 - α × 0.24'
        if(tmp.ac.unlocks>=1){f3 = colorText('Max( ','#bf8f8f')+'1 - α × 0.24, 0.02'+colorText(' ) ','#bf8f8f')}

        let roc = player.ro.c.gt(0) ? '<sup>RC</sup>' : ''
        let g6 = tmp.goals.unlocks>=6 ? ' + B<sub>01</sub> / 222.22' : ''
        let fg = colorText('γ'+roc+' × 0.2 × (','#77bf5f')+colorText(' Max( ','#bf8f8f')+'γ'+roc+', 1'+colorText(' ) / ( ','#bf8f8f')+' 2 + γ '+colorText(' ) ','#bf8f8f')+' '+colorText(') + 1'+g6,'#77bf5f')
        
        return [f, f2, f3, fg];
    },
    calculateValue(val=player[this.layer].points) {
        val = val.sub(player.a2.beta).add(1)
        if(tmp.ac.unlocks>=4){
            val = val.add(player.a2.beta)
        }

        return val;
    },
    calculateValueBeta(val=player[this.layer].points) {
        let a = player.a2.beta.add(1).pow(val.div(20).add(0.7))

        return a;
    },
    calculateValueGamma() {
        let a = player.a2.gamma.pow(player.ro.valueC).mul(0.2).mul(player.a2.gamma.pow(player.ro.valueC).max(1).div(n(2).add(player.a2.gamma))).add(1).add(player.b.power.div(222.22))

        return a;
    },
    update(diff) {
        player[this.layer].value = tmp[this.layer].calculateValue
        player[this.layer].valueBeta = tmp[this.layer].calculateValueBeta
        player[this.layer].valueGamma = tmp[this.layer].calculateValueGamma

        if(n(player.a.buyables[11]).gt(player.a2.gamma)){
            player.a2.gamma = player.a.buyables[11]
        }

        if(tmp.ac.unlocks>=4){
            player.a2.beta = n(player.a2.points)
        }
    },
    timespeedBoost(){
        if(tmp.ac.unlocks>=1){return n(1).sub(player.a2.points.mul(0.24)).max(0.02)}
        return n(1).sub(player.a2.points.mul(0.24))
    },
	clickables: {
		11: {
			title:"-",
			titleEN:"-",
			canClick(){
				return player.a2.beta.gt(0)
			},
			onClick(){
                player.a2.beta = player.a2.beta.sub(1)
                player.points = n(0)
			},
			style() {return {'height': "50px", 'min-height': "50px", 'width': '50px',"border-radius": "5%",}},
            unlocked(){return tmp.ac.unlocks<=3},
		},
		12: {
			title:"+",
			titleEN:"+",
			canClick(){
				return player.a2.points.sub(player.a2.beta).gt(0)
			},
			onClick(){
                player.a2.beta = player.a2.beta.add(1)
                player.points = n(0)
			},
			style() {return {'height': "50px", 'min-height': "50px", 'width': '50px',"border-radius": "5%",}},
            unlocked(){return tmp.ac.unlocks<=3},
		},
	},
    tabFormat: [
        "main-display",
        "prestige-button",
        "blank",
        "blank",
        ["display-text", function() {
            if(player.a2.gamma.gte(1)){
                return "<h3>α/β/γ = "+format(player[this.layer].points,0)+'/'+format(player[this.layer].beta,0)+'/'+format(player[this.layer].gamma,0)+'</h3>'
            }
            if(player[this.layer].unlocked){
                return "<h3>α/β = "+format(player[this.layer].points,0)+'/'+format(player[this.layer].beta,0)+'</h3>'
            }
        }],,
        "blank",
        ["display-text", function() { return "<h3>exp("+formatWhole(player[this.layer].points)+") = "+format(player[this.layer].value)+"</h3>" }],
        ["display-text", function() { return "exp(α) = "+tmp[this.layer].displayFormula[0] }],
        "blank",
        ["display-text", function() { return "<h3>mul("+formatWhole(player[this.layer].beta)+") = "+format(player[this.layer].valueBeta)+"</h3>" }],
        ["display-text", function() { return "mul(β) = "+tmp[this.layer].displayFormula[1] }],
        "blank",
        ["display-text", function() { return player.a2.gamma.gte(1) ? "<h3>gamma("+formatWhole(player[this.layer].gamma)+") = "+format(player[this.layer].valueGamma)+"</h3>" : ''}],
        ["display-text", function() { return player.a2.gamma.gte(1) ? "gamma(γ) = "+tmp[this.layer].displayFormula[3] : ''}],
        "blank",
        ["display-text", function() { return "<h3>timewall("+formatWhole(player[this.layer].points)+") = "+format(tmp[this.layer].timespeedBoost)+"</h3>" }],
        ["display-text", function() { return "timewall(α) = "+tmp[this.layer].displayFormula[2] }],
        "blank",
        "blank",
        "blank",
        'clickables'
    ],
    componentStyles: {
        buyable: {
            width: "140px",
            height: "100px",
            "border-radius": "5%",
            "z-index": "1",
        },
        bar: {
            "z-index": "0",
        },
    },
    branches: ["a"],
})
