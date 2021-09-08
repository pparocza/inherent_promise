class Piece {
    
    constructor(){

    }

    initMasterChannel(){

        this.globalNow = 0;

        this.gain = audioCtx.createGain();
        this.gain.gain.value = 3;
    
        this.fadeFilter = new FilterFade(0);
    
        this.masterGain = audioCtx.createGain();
        this.masterGain.connect(this.gain);
        this.gain.connect(this.fadeFilter.input);
        this.fadeFilter.connect(audioCtx.destination);

    }

    initFXChannels(){


    }

    load(){

        this.dO1 = new DelayOsc( this );
        this.dO1.load11();

    }

    start(){

        this.fadeFilter.start(1, 50);
		this.globalNow = audioCtx.currentTime;

        this.dO1.play();


    }

    stop() {

        this.fadeFilter.start(0, 20);
        startButton.innerHTML = "reset";

    }

}

class DelayOsc extends Piece {

    constructor( piece ){

        super();

        this.output = new MyGain ( 0 );

        this.output.connect( piece.masterGain );

    }

    load1() {

        this.d1 = new MyDelay( 0 , 0);

        this.oB = new MyBuffer2( 1 , 1 , audioCtx.sampleRate );
        this.oB.sine( 1 , 1 ).fill( 0 );
        this.oB.playbackRate = 20;
        this.oB.loop = true;

        this.dB = new MyBuffer2( 1 , 1 , audioCtx.sampleRate );
        this.dB.sine( 1 , 1 ).add( 0 );
        this.dB.sine( 10 , 1 ).add( 0 );

        this.dB.normalize( -1 , 1 );

        this.dB.constant( 1 ).add( 0 );
        this.dB.constant( 0.03125 ).multiply( 0 );
        this.dB.playbackRate = 100;
        this.dB.loop = true;

        this.dBG = new MyGain( 0 );
        this.dBGO = new MyBuffer2( 1 , 1 , audioCtx.sampleRate );
        this.dBGO.ramp( 0 , 1 , 0.01 , 0.015 , 0.1 , 8 ).add( 0 );
        this.dBGO.playbackRate = 1;
        this.dBGO.loop = true;

        this.dB.connect( this.dBG ); this.dBGO.connect( this.dBG.gain.gain );
        this.dBG.connect( this.d1.delay.delayTime );
        this.oB.connect( this.d1 );

        // FX

        this.p1 = new SemiOpenPipe( 1000 );
        this.p2 = new SemiOpenPipe( 2000 );

        this.pD1 = new Effect();
        this.pD2 = new Effect();
        this.pD1.randomShortDelay();
        this.pD2.randomShortDelay();
        this.pD1.on();
        this.pD2.on();

        this.s = new SchwaBox( 'ae' );
        this.s.output.gain.value = 0.0125;

        // CONNECTIONS

        this.d1.connect( this.output );

        this.d1.connect( this.p1 );
        this.p1.connect( this.pD1 );
        this.pD1.connect( this.output );

        this.d1.connect( this.p2 );
        this.p2.connect( this.pD2 );
        this.pD2.connect( this.output );

        this.d1.connect( this.s );

        this.s.connect( this.output );

        this.output.gain.gain.value = 0.05;

    }

    load2() {

        this.d1 = new MyDelay( 0 , 0);

        this.oB = new MyBuffer2( 1 , 1 , audioCtx.sampleRate );
        this.oB.sine( 1 , 1 ).fill( 0 );
        this.oB.playbackRate = 20;
        this.oB.loop = true;

        this.dB = new MyBuffer2( 1 , 1 , audioCtx.sampleRate );

        for( let i = 0 ; i < 5 ; i++ ){

            this.dB.fm( randomInt( 1 , 20 ) , randomInt( 1 , 20 ) , randomInt( 0.1 , 0.5 ) , randomFloat( 0.1 , 1 ) ).add( 0 );

        }

        this.dB.normalize( -1 , 1 );

        this.dB.constant( 1 ).add( 0 );
        this.dB.constant( 0.03125 ).multiply( 0 );
        this.dB.playbackRate = 20;
        this.dB.loop = true;

        this.dBG = new MyGain( 0 );
        this.dBGO = new MyBuffer2( 1 , 1 , audioCtx.sampleRate );
        this.dBGO.ramp( 0 , 1 , 0.01 , 0.015 , 0.1 , 8 ).add( 0 );
        this.dBGO.playbackRate = 1;
        this.dBGO.loop = true;

        this.dB.connect( this.dBG ); this.dBGO.connect( this.dBG.gain.gain );
        this.dBG.connect( this.d1.delay.delayTime );
        this.oB.connect( this.d1 );

        // CONNECTIONS

        this.d1.connect( this.output );

        this.output.gain.gain.value = 0.05;

    }

    load3() {

        this.d1 = new MyDelay( 0 , 0);

        this.oB = new MyBuffer2( 1 , 1 , audioCtx.sampleRate );
        this.oB.sine( 1 , 1 ).fill( 0 );
        this.oB.playbackRate = 40;
        this.oB.loop = true;

        this.dB = new MyBuffer2( 1 , 1 , audioCtx.sampleRate );

        for( let i = 0 ; i < 10 ; i++ ){

            this.dB.fm( randomInt( 1 , 20 ) , randomInt( 1 , 20 ) , randomInt( 0.1 , 0.5 ) , randomFloat( 0.1 , 1 ) ).add( 0 );

        }

        this.dB.normalize( -1 , 1 );

        this.dB.constant( 1 ).add( 0 );
        this.dB.constant( 0.03125 ).multiply( 0 );
        this.dB.playbackRate = 10;
        this.dB.loop = true;

        this.dBG = new MyGain( 0 );
        this.dBGO = new MyBuffer2( 1 , 1 , audioCtx.sampleRate );
        this.dBGO.ramp( 0 , 1 , 0.5 , 0.5 , 1 , 1 ).add( 0 );
        this.dBGO.playbackRate = 0.25;
        this.dBGO.loop = true;

        this.dB.connect( this.dBG ); this.dBGO.connect( this.dBG.gain.gain );
        this.dBG.connect( this.d1.delay.delayTime );
        this.oB.connect( this.d1 );

        // CONNECTIONS

        this.d1.connect( this.output );

        this.output.gain.gain.value = 0.05;

    }

    load4() {

        this.d1 = new MyDelay( 0 , 0);

        this.oB = new MyBuffer2( 1 , 1 , audioCtx.sampleRate );
        this.oB.sine( 1 , 1 ).fill( 0 );
        this.oB.playbackRate = 120;
        this.oB.loop = true;

        this.dB = new MyBuffer2( 1 , 1 , audioCtx.sampleRate );

        for( let i = 0 ; i < 20 ; i++ ){

            this.dB.sine( randomFloat( 1 , 100 ) , randomFloat( 0.1 , 1 ) ).add( 0 );

        }

        this.dB.normalize( -1 , 1 );

        this.dB.constant( 1 ).add( 0 );
        this.dB.constant( 0.03125 ).multiply( 0 );
        this.dB.playbackRate = 100;
        this.dB.loop = true;

        this.dBG = new MyGain( 0 );
        this.dBGO = new MyBuffer2( 1 , 1 , audioCtx.sampleRate );
        this.dBGO.ramp( 0 , 1 , 0.01 , 0.015 , 0.1 , 8 ).add( 0 );
        this.dBGO.playbackRate = 1;
        this.dBGO.loop = true;

        this.aB = new MyBuffer2( 1 , 1 , audioCtx.sampleRate );
        this.aB.ramp( 0 , 1 , 0.01 , 0.015 , 0.1 , 8).add( 0 );
        this.aB.constant( 1 ).multiply( 0 );
        this.aB.playbackRate = 1;
        this.aB.loop = true;

        this.aG = new MyGain( 0 );

        this.dB.connect( this.dBG ); this.dBGO.connect( this.dBG.gain.gain );
        this.dBG.connect( this.d1.delay.delayTime );

        this.oB.connect( this.aG ); this.aB.connect( this.aG.gain.gain );
        this.aG.connect( this.d1 );

        // CONNECTIONS

        this.d1.connect( this.output );

        this.output.gain.gain.value = 0.05;

    }

    load5() {

        this.d1 = new MyDelay( 0 , 0);

        this.oB = new MyBuffer2( 1 , 1 , audioCtx.sampleRate );
        this.oB.sine( 1 , 1 ).fill( 0 );
        this.oB.playbackRate = 40;
        this.oB.loop = true;

        this.dB = new MyBuffer2( 1 , 1 , audioCtx.sampleRate );

        for( let i = 0 ; i < 20 ; i++ ){

            this.dB.sine( randomFloat( 1 , 100 ) , randomFloat( 0.1 , 1 ) ).add( 0 );

        }

        this.dB.normalize( -1 , 1 );

        this.dB.constant( 1 ).add( 0 );
        this.dB.constant( 0.03125 ).multiply( 0 );
        this.dB.playbackRate = 100;
        this.dB.loop = true;

        this.dBG = new MyGain( 0 );
        this.dBGO = new MyBuffer2( 1 , 1 , audioCtx.sampleRate );
        this.dBGO.ramp( 0 , 1 , 0.01 , 0.015 , 0.1 , 8 ).add( 0 );
        this.dBGO.playbackRate = 1;
        this.dBGO.loop = true;

        this.aB = new MyBuffer2( 1 , 1 , audioCtx.sampleRate );
        this.aB.ramp( 0 , 1 , 0.01 , 0.015 , 0.1 , 8).add( 0 );
        this.aB.constant( 1 ).multiply( 0 );
        this.aB.playbackRate = 1;
        this.aB.loop = true;

        this.aG = new MyGain( 0 );

        this.dB.connect( this.dBG ); this.dBGO.connect( this.dBG.gain.gain );
        this.dBG.connect( this.d1.delay.delayTime );

        this.oB.connect( this.aG ); this.aB.connect( this.aG.gain.gain );
        this.aG.connect( this.d1 );

        // CONNECTIONS

        this.d1.connect( this.output );

        this.output.gain.gain.value = 0.05;

    }

    load6() {

        this.d1 = new MyDelay( 0 , 0 );

        this.oB = new MyBuffer2( 1 , 1 , audioCtx.sampleRate );

        this.oB.sine( 1 , 1 ).fill( 0 );
        this.oB.sine( 4 , 1 ).fill( 0 );
        this.oB.sine( 2 , 1 ).fill( 0 );
        this.oB.sine( 5 , 1 ).fill( 0 );

        this.oB.normalize( -1 , 1 );

        this.oB.playbackRate = 20;
        this.oB.loop = true;

        this.dB = new MyBuffer2( 1 , 1 , audioCtx.sampleRate );

        for( let i = 0 ; i < 10 ; i++ ){

            this.dB.sine( randomFloat( 2000 , 4000 ) , randomFloat( 0.1 , 1 ) ).add( 0 );

        }

        this.dB.normalize( -1 , 1 );

        this.dB.constant( 1 ).add( 0 );
        this.dB.constant( 0.03125 * 0.0625 ).multiply( 0 );
        this.dB.playbackRate = 100;
        this.dB.loop = true;

        this.dBG = new MyGain( 0 );
        this.dBGO = new MyBuffer2( 1 , 1 , audioCtx.sampleRate );
        this.dBGO.ramp( 0 , 1 , 0.5 , 0.5 , 1 , 1 ).add( 0 );
        this.dBGO.playbackRate = 0.25;
        this.dBGO.loop = true;

        this.aB = new MyBuffer2( 1 , 1 , audioCtx.sampleRate );
        this.aB.ramp( 0 , 1 , 0.01 , 0.015 , 0.1 , 8).add( 0 );
        this.aB.constant( 1 ).multiply( 0 );
        this.aB.playbackRate = 1;
        this.aB.loop = true;

        this.aG = new MyGain( 0 );

        this.dB.connect( this.dBG ); this.dBGO.connect( this.dBG.gain.gain );
        this.dBG.connect( this.d1.delay.delayTime );

        this.oB.connect( this.aG ); this.aB.connect( this.aG.gain.gain );
        this.aG.connect( this.d1 );

        // CONNECTIONS

        this.d1.connect( this.output );

        this.output.gain.gain.value = 0.05;

    }

    load7() {

        this.d1 = new MyDelay( 0 , 0 );

        this.oB = new MyBuffer2( 1 , 1 , audioCtx.sampleRate );

        this.oB.sine( 1 , 1 ).fill( 0 );
        this.oB.sine( 2 , 1 ).fill( 0 );

        this.oB.normalize( -1 , 1 );

        this.oB.playbackRate = 60;
        this.oB.loop = true;

        this.dB = new MyBuffer2( 1 , 1 , audioCtx.sampleRate );

        for( let i = 0 ; i < 10 ; i++ ){

            this.dB.sine( randomFloat( 10 , 40 ) , randomFloat( 10 , 40 ) , randomFloat( 100 , 400 ) ).add( 0 );

        }

        this.dB.normalize( -1 , 1 );

        this.dB.constant( 1 ).add( 0 );
        this.dB.constant( 0.03125 * 0.03125 ).multiply( 0 );
        this.dB.playbackRate = 160;
        this.dB.loop = true;

        this.dBG = new MyGain( 0 );
        this.dBGO = new MyBuffer2( 1 , 1 , audioCtx.sampleRate );
        this.dBGO.ramp( 0 , 1 , 0.01 , 0.015 , 1 , 1 ).add( 0 );
        this.dBGO.playbackRate = 1;
        this.dBGO.loop = true;

        this.aB = new MyBuffer2( 1 , 1 , audioCtx.sampleRate );
        this.aB.ramp( 0 , 1 , 0.01 , 0.015 , 0.1 , 8).add( 0 );
        this.aB.constant( 1 ).multiply( 0 );
        this.aB.playbackRate = 1;
        this.aB.loop = true;

        this.aG = new MyGain( 0 );

        this.dB.connect( this.dBG ); this.dBGO.connect( this.dBG.gain.gain );
        this.dBG.connect( this.d1.delay.delayTime );

        this.oB.connect( this.aG ); this.aB.connect( this.aG.gain.gain );
        this.aG.connect( this.d1 );

        // CONNECTIONS

        this.d1.connect( this.output );

        this.output.gain.gain.value = 0.05;

    }

    load8() {

        this.fund = 40;

        this.d1 = new MyDelay( 0 , 0);

        this.oB = new MyBuffer2( 1 , 1 , audioCtx.sampleRate );
        this.oB.sine( 1 , 1 ).fill( 0 );
        this.oB.playbackRate = this.fund;
        this.oB.loop = true;

        this.dB = new MyBuffer2( 1 , 1 , audioCtx.sampleRate );

        this.f = new MyBiquad( 'notch' , this.fund , 2 );

        for( let i = 0 ; i < 10 ; i++ ){

            this.dB.fm( this.fund * randomArrayValue( [ 1 , P5 , 2 ] ) , this.fund * randomArrayValue( [ 1 , P5 , 2 ] ) , randomInt( 0.1 , 0.25 ) , randomFloat( 0.1 , 1 ) ).add( 0 );

        }

        this.dB.normalize( -1 , 1 );

        this.dB.constant( 1 ).add( 0 );
        this.dB.constant( 0.03125 ).multiply( 0 );
        this.dB.playbackRate = 20;
        this.dB.loop = true;

        this.dBG = new MyGain( 0 );
        this.dBGO = new MyBuffer2( 1 , 1 , audioCtx.sampleRate );
        this.dBGO.ramp( 0 , 1 , 0.01 , 0.015 , 0.5 , 8 ).add( 0 );
        this.dBGO.playbackRate = 1;
        this.dBGO.loop = true;

        this.dB.connect( this.dBG ); this.dBGO.connect( this.dBG.gain.gain );
        this.dBG.connect( this.d1.delay.delayTime );
        this.oB.connect( this.d1 );

        this.fO = new MyOsc( 'sine' , 0 );
        this.fOG = new MyGain( 432 * 2 );

        // CONNECTIONS

        this.d1.connect( this.f );
        this.f.connect( this.fOG );
        this.fOG.connect( this.fO.frequencyInlet );
        this.fO.connect( this.output );

        this.output.gain.gain.value = 0.05;

    }

    load9() {

        this.fund = 80;

        this.d1 = new MyDelay( 0 , 0);

        this.oB = new MyBuffer2( 1 , 1 , audioCtx.sampleRate );
        
        this.oB.sine( 1 , 1 ).fill( 0 );
        this.oB.sine( 2 , 1 ).fill( 0 );
        this.oB.sine( 0.25 , 1 ).fill( 0 );
        this.oB.sine( 0.5 , 1 ).fill( 0 );

        this.oB.normalize( -1 , 1 );

        this.oB.playbackRate = this.fund;
        this.oB.loop = true;

        this.dB = new MyBuffer2( 1 , 1 , audioCtx.sampleRate );

        for( let i = 0 ; i < 10 ; i++ ){

            this.dB.fm( this.fund * randomArrayValue( [ 1 , P5 , 2 ] ) , this.fund * randomArrayValue( [ 1 , P5 , 2 ] ) , randomInt( 0.1 , 0.25 ) , randomFloat( 0.1 , 1 ) ).add( 0 );

        }

        this.dB.normalize( -1 , 1 );

        this.dB.constant( 1 ).add( 0 );
        this.dB.constant( 0.03125 ).multiply( 0 );
        this.dB.playbackRate = 20;
        this.dB.loop = true;

        this.dBG = new MyGain( 0 );
        this.dBGO = new MyBuffer2( 1 , 1 , audioCtx.sampleRate );
        this.dBGO.ramp( 0 , 1 , 0.01 , 0.015 , 0.5 , 8 ).add( 0 );
        this.dBGO.playbackRate = 1;
        this.dBGO.loop = true;

        this.dB.connect( this.dBG ); this.dBGO.connect( this.dBG.gain.gain );
        this.dBG.connect( this.d1.delay.delayTime );
        this.oB.connect( this.d1 );

        this.fO = new MyOsc( 'sine' , 0 );
        this.fOG = new MyGain( 1000 );

        this.aG = new MyGain( 0 );

        // CONNECTIONS

        this.d1.connect( this.fOG );
        this.fOG.connect( this.fO.frequencyInlet );
        this.fO.connect( this.aG ); this.dBGO.connect( this.aG.gain.gain );
        this.aG.connect( this.output );

        this.output.gain.gain.value = 0.15;

    }

    load10() {

        this.fund = 80;

        this.d1 = new MyDelay( 0 , 0);

        this.oB = new MyBuffer2( 1 , 1 , audioCtx.sampleRate );
        
        this.oB.sine( 1 , 1 ).fill( 0 );
        this.oB.sine( 2 , 1 ).fill( 0 );
        this.oB.sine( 0.25 , 1 ).fill( 0 );
        this.oB.sine( 0.5 , 1 ).fill( 0 );
        this.oB.sine( 3 , 1 ).fill( 0 );
        this.oB.sine( 5 , 1 ).fill( 0 );

        this.oB.normalize( -1 , 1 );

        this.oB.playbackRate = this.fund;
        this.oB.loop = true;

        this.dB = new MyBuffer2( 1 , 1 , audioCtx.sampleRate );

        for( let i = 0 ; i < 10 ; i++ ){

            this.dB.fm( this.fund * randomArrayValue( [ 1 , P5 , 2 ] ) , this.fund * randomArrayValue( [ 1 , P5 , 2 ] ) , randomInt( 0.1 , 0.25 ) , randomFloat( 0.1 , 1 ) ).add( 0 );

        }

        this.dB.normalize( -1 , 1 );

        this.dB.constant( 1 ).add( 0 );
        this.dB.constant( 0.03125 ).multiply( 0 );
        this.dB.playbackRate = 80;
        this.dB.loop = true;

        this.dBG = new MyGain( 0 );
        this.dBGO = new MyBuffer2( 1 , 1 , audioCtx.sampleRate );
        this.dBGO.ramp( 0 , 1 , 0.01 , 0.015 , 0.5 , 8 ).add( 0 );
        this.dBGO.playbackRate = 0.25;
        this.dBGO.loop = true;

        this.dB.connect( this.dBG ); this.dBGO.connect( this.dBG.gain.gain );
        this.dBG.connect( this.d1.delay.delayTime );
        this.oB.connect( this.d1 );

        this.fO = new MyOsc( 'sine' , 0 );
        this.fOG = new MyGain( 200 );

        this.aG = new MyGain( 0 );

        // CONNECTIONS

        this.d1.connect( this.fOG );
        this.fOG.connect( this.fO.frequencyInlet );
        this.fO.connect( this.aG ); this.dBGO.connect( this.aG.gain.gain );
        this.aG.connect( this.output );

        this.output.gain.gain.value = 0.15;

    }

    load11() {

        this.fund = 100;

        this.d1 = new MyDelay( 0 , 0);

        this.oB = new MyBuffer2( 1 , 1 , audioCtx.sampleRate );
        
        this.oB.sine( 1 , 1 ).fill( 0 );
        this.oB.sine( 2 , 1 ).fill( 0 );
        this.oB.sine( 0.25 , 1 ).fill( 0 );
        this.oB.sine( 0.5 , 1 ).fill( 0 );
        this.oB.sine( 3 , 1 ).fill( 0 );
        this.oB.sine( 5 , 1 ).fill( 0 );
        this.oB.sine( 1 * M3 , 1 ).fill( 0 );

        this.oB.normalize( -1 , 1 );

        this.oB.playbackRate = this.fund;
        this.oB.loop = true;

        this.dB = new MyBuffer2( 1 , 1 , audioCtx.sampleRate );

        for( let i = 0 ; i < 10 ; i++ ){

            this.dB.fm( this.fund * randomArrayValue( [ 1 , P5 , 2 ] ) , this.fund * randomArrayValue( [ 1 , P5 , 2 ] ) , randomInt( 0.1 , 0.25 ) , randomFloat( 0.1 , 1 ) ).add( 0 );

        }

        this.dB.normalize( -1 , 1 );

        this.dB.constant( 1 ).add( 0 );
        this.dB.constant( 0.03125 ).multiply( 0 );
        this.dB.playbackRate = 20;
        this.dB.loop = true;

        this.dBG = new MyGain( 0 );
        this.dBGO = new MyBuffer2( 1 , 1 , audioCtx.sampleRate );
        this.dBGO.ramp( 0 , 1 , 0.01 , 0.015 , 0.5 , 8 ).add( 0 );
        this.dBGO.playbackRate = 0.25;
        this.dBGO.loop = true;

        this.dB.connect( this.dBG ); this.dBGO.connect( this.dBG.gain.gain );
        this.dBG.connect( this.d1.delay.delayTime );
        this.oB.connect( this.d1 );

        this.fO = new MyOsc( 'sine' , 0 );
        this.fOG = new MyGain( 200 );

        this.aG = new MyGain( 0 );

        // CONNECTIONS

        this.d1.connect( this.fOG );
        this.fOG.connect( this.fO.frequencyInlet );
        this.fO.connect( this.aG ); this.dBGO.connect( this.aG.gain.gain );
        this.aG.connect( this.output );

        this.output.gain.gain.value = 0.15;

    }

    play() {

        this.oB.start();
        this.dB.start();
        this.dBGO.start();

        if( this.aB ){
            this.aB.start();
        }

        if( this.fO ){
            this.fO.start();
        }

    }

}