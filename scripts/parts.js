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

        // REVERB 

        this.cSend = new MyConvolver();
        this.cSendB = new MyBuffer2( 2 , 2 , audioCtx.sampleRate );
        this.cSendB.noise().add( 0 );
        this.cSendB.noise().add( 1 );
        this.cSendB.ramp( 0 , 1 , 0.01 , 0.015 , 0.1 , 3 ).multiply( 0 );
        this.cSendB.ramp( 0 , 1 , 0.01 , 0.015 , 0.1 , 3 ).multiply( 1 );
        this.cSend.setBuffer( this.cSendB.buffer );

        this.cSendIn = new MyGain( 1 );

        this.cSendIn.connect( this.cSend );
        this.cSend.connect( this.masterGain );

        // DELAY

        this.dSend = new Effect();
        this.dSend.randomShortDelay();
        this.dSend.on();
        this.dSend.output.gain.value = 1;

        this.dSendIn = new MyGain( 0.75 );

        this.dSendIn.connect( this.dSend );
        this.dSend.connect( this.masterGain );

        this.dSend.connect( this.cSendIn );

    }

    load(){

        this.loadLoad15Experiments();

    }

    start(){

        this.fadeFilter.start(1, 50);
		this.globalNow = audioCtx.currentTime;
        
        this.startLoad15Experiments();

    }

    loadLoad15Experiments(){

        this.loadLoad15ExperimentsSus();

    }

    startLoad15Experiments(){

        this.startLoad15ExperimentsSus();

    }

    loadLoad15ExperimentsPercussion(){

        const onsetRate = 0.25;
        const gainVal = 0.15

        // fund , iArray , modRate , envelopeRate , modWidth , gainVal

        // ORIGINAL load15
        this.dO1 = new DelayOsc( this );
        this.dO1.load15Args( 20 , [ M7 ] , 80 , onsetRate , 400 , gainVal );

        // 2
        this.dO2 = new DelayOsc( this );
        this.dO2.load15Args( 200 , [ M7 ] , 80 , onsetRate * 4 , 400 , gainVal );

        // 3
        this.dO3 = new DelayOsc( this );
        this.dO3.load15Args( 200 , [ M7 , M3 ] , 80 , onsetRate * 1 , 400 , gainVal );

        // 4
        this.dO4 = new DelayOsc( this );
        this.dO4.load15Args( 1000 , [ M7 , M3 , M2 , P5 ] , 160 , onsetRate * 8 , 1600 , gainVal * 0.3 );

        // 5
        this.dO5 = new DelayOsc( this );
        this.dO5.load15Args( 5000 , [ M7 , M3 , M2 , P5 , 1 , 2 , 2.4 , 7 ] , 800 , onsetRate * 32 , 1600 , gainVal * 0.15 );

        // 6
        this.dO6 = new DelayOsc( this );
        this.dO6.load15Args( 10000 , [ 1 , 2 , 2.4 , 7 ] , 800 , onsetRate * 2 , 3200 , gainVal * 0.3 );

        // 7
        this.dO7 = new DelayOsc( this );
        this.dO7.load15Args( 8000 , [ 1 , 2 , 3.4 , 7 , 11 ] , 2000 , onsetRate * 4 , 3200 , gainVal * 0.3 );

        // 8
        this.dO8 = new DelayOsc( this );
        this.dO8.load15Args( 500 , [ 1 ] , 160 , onsetRate * 8 , 3200 , gainVal * 0.2 );

        // 9
        this.dO9 = new DelayOsc( this );
        this.dO9.load15Args( 1000 , [ 1 , 3.3 , 5.7 , 11.5 , 13 ] , 320 , onsetRate * 8 , 56000 , gainVal * 0.05 );

    }

    loadLoad15ExperimentsSus(){

        const onsetRate = 0.25;
        const nDOS = 4;
        const gainVal = 0.15 / nDOS;

        this.dOSA = [];

        // fund , iArray , modRate , envelopeRate , modWidth , gainVal

        for( let i = 0 ; i < nDOS ; i++ ){

            this.dOSA[i] = new DelayOsc( this );
            this.dOSA[i].load15ArgsB( randomFloat( 20 , 1000 ) , [ 1 , 1.1 , 1.2 , 1.3 , 1.4 ] , randomFloat( 40 , 200 ) , onsetRate * randomFloat( 0.125 , 1 ) , randomFloat( 400 , 2000 ) , gainVal );

        }

    }

    startLoad15ExperimentsPercussion(){

        this.dO1.play( this.globalNow + 0 );
        this.dO2.play( this.globalNow + 0 );
        this.dO3.play( this.globalNow + 1 );
        this.dO4.play( this.globalNow + 0.25 );
        this.dO5.play( this.globalNow + 0 );
        this.dO6.play( this.globalNow + 0.5 );
        this.dO7.play( this.globalNow + 0.5 );
        this.dO8.play( this.globalNow + 0.5 );
        this.dO9.play( this.globalNow + 0.25 );

    }

    startLoad15ExperimentsSus(){

        for(const element of this.dOSA){
            element.play( this.globalNow + randomFloat( 0 , 5 ) );
        }

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
        this.output.connect( piece.cSendIn );
        this.output.connect( piece.dSendIn );

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

    load12() {

        this.fund = 1000;

        this.d1 = new MyDelay( 0 , 0);

        this.oB = new MyBuffer2( 1 , 1 , audioCtx.sampleRate );
        
        this.oB.sine( M2 , 1 ).fill( 0 );
        this.oB.sine( M3 , 1 ).fill( 0 );
        this.oB.sine( P5 , 1 ).fill( 0 );
        this.oB.sine( M6 , 1 ).fill( 0 );
        this.oB.sine( M7 , 1 ).fill( 0 );

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
        this.fOG = new MyGain( 400 );

        this.aG = new MyGain( 0 );

        // CONNECTIONS

        this.d1.connect( this.fOG );
        this.fOG.connect( this.fO.frequencyInlet );
        this.fO.connect( this.aG ); this.dBGO.connect( this.aG.gain.gain );
        this.aG.connect( this.output );

        this.output.gain.gain.value = 0.15;

    }

    load13() {

        this.fund = 1000;

        this.d1 = new MyDelay( 0 , 0);

        this.oB = new MyBuffer2( 1 , 1 , audioCtx.sampleRate );
        
        this.oB.sine( M2 , 1 ).fill( 0 );
        this.oB.sine( M3 , 1 ).fill( 0 );
        this.oB.sine( P5 , 1 ).fill( 0 );
        this.oB.sine( M6 , 1 ).fill( 0 );
        this.oB.sine( M7 , 1 ).fill( 0 );

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
        this.fOG = new MyGain( 400 );

        this.aG = new MyGain( 0 );

        this.d = new Effect();
        this.d.randomShortDelay();
        this.d.on();
        this.d.output.gain.value = 0.5;

        this.c = new MyConvolver();
        this.cB = new MyBuffer2( 2 , 2 , audioCtx.sampleRate );
        this.cB.noise().add( 0 );
        this.cB.noise().add( 1 );
        this.cB.ramp( 0 , 1 , 0.01 , 0.015 , 0.1 , 3 ).multiply( 0 );
        this.cB.ramp( 0 , 1 , 0.01 , 0.015 , 0.1 , 3 ).multiply( 1 );
        this.c.setBuffer( this.cB.buffer );

        // CONNECTIONS

        this.d1.connect( this.fOG );
        this.fOG.connect( this.fO.frequencyInlet );
        this.fO.connect( this.aG ); this.dBGO.connect( this.aG.gain.gain );
        this.aG.connect( this.output );

        this.aG.connect( this.d );
        this.d.connect( this.output );

        this.aG.connect( this.c );
        this.c.connect( this.output );

        this.output.gain.gain.value = 0.15;

    }

    load14() {

        this.fund = 100;

        this.d1 = new MyDelay( 0 , 0);

        this.oB = new MyBuffer2( 1 , 1 , audioCtx.sampleRate );
        
        this.oB.sine( M2 , 1 ).fill( 0 );
        this.oB.sine( M3 , 1 ).fill( 0 );
        this.oB.sine( P5 , 1 ).fill( 0 );
        this.oB.sine( M6 , 1 ).fill( 0 );
        this.oB.sine( M7 , 1 ).fill( 0 );

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
        this.fOG = new MyGain( 400 );

        this.aG = new MyGain( 0 );

        this.d = new Effect();
        this.d.randomShortDelay();
        this.d.on();
        this.d.output.gain.value = 0.5;

        this.c = new MyConvolver();
        this.cB = new MyBuffer2( 2 , 2 , audioCtx.sampleRate );
        this.cB.noise().add( 0 );
        this.cB.noise().add( 1 );
        this.cB.ramp( 0 , 1 , 0.01 , 0.015 , 0.1 , 3 ).multiply( 0 );
        this.cB.ramp( 0 , 1 , 0.01 , 0.015 , 0.1 , 3 ).multiply( 1 );
        this.c.setBuffer( this.cB.buffer );

        // CONNECTIONS

        this.d1.connect( this.fOG );
        this.fOG.connect( this.fO.frequencyInlet );
        this.fO.connect( this.aG ); this.dBGO.connect( this.aG.gain.gain );
        this.aG.connect( this.output );

        this.aG.connect( this.d );
        this.d.connect( this.output );

        this.aG.connect( this.c );
        this.c.connect( this.output );

        this.output.gain.gain.value = 0.15;

    }

    load15() {

        this.fund = 20;

        this.d1 = new MyDelay( 0 , 0);

        this.oB = new MyBuffer2( 1 , 1 , audioCtx.sampleRate );
        
        this.oB.sine( M7 , 1 ).fill( 0 );

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
        this.fOG = new MyGain( 400 );

        this.aG = new MyGain( 0 );

        this.d = new Effect();
        this.d.randomShortDelay();
        this.d.on();
        this.d.output.gain.value = 0.5;

        this.c = new MyConvolver();
        this.cB = new MyBuffer2( 2 , 2 , audioCtx.sampleRate );
        this.cB.noise().add( 0 );
        this.cB.noise().add( 1 );
        this.cB.ramp( 0 , 1 , 0.01 , 0.015 , 0.1 , 3 ).multiply( 0 );
        this.cB.ramp( 0 , 1 , 0.01 , 0.015 , 0.1 , 3 ).multiply( 1 );
        this.c.setBuffer( this.cB.buffer );

        // CONNECTIONS

        this.d1.connect( this.fOG );
        this.fOG.connect( this.fO.frequencyInlet );
        this.fO.connect( this.aG ); this.dBGO.connect( this.aG.gain.gain );
        this.aG.connect( this.output );

        this.aG.connect( this.d );
        this.d.connect( this.output );

        this.aG.connect( this.c );
        this.c.connect( this.output );

        this.output.gain.gain.value = 0.15;

    }

    load16() {

        this.fund = 200;

        this.d1 = new MyDelay( 0 , 0);

        this.oB = new MyBuffer2( 1 , 1 , audioCtx.sampleRate );
        
        this.oB.sine( M2 , 1 ).fill( 0 );
        this.oB.sine( M3 , 1 ).fill( 0 );
        this.oB.sine( P5 , 1 ).fill( 0 );
        this.oB.sine( M6 , 1 ).fill( 0 );
        this.oB.sine( M7 , 1 ).fill( 0 );

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
        this.fOG = new MyGain( 400 );

        this.aG = new MyGain( 0 );

        this.d = new Effect();
        this.d.randomShortDelay();
        this.d.on();
        this.d.output.gain.value = 0.5;

        this.c = new MyConvolver();
        this.cB = new MyBuffer2( 2 , 2 , audioCtx.sampleRate );
        this.cB.noise().add( 0 );
        this.cB.noise().add( 1 );
        this.cB.ramp( 0 , 1 , 0.01 , 0.015 , 0.1 , 3 ).multiply( 0 );
        this.cB.ramp( 0 , 1 , 0.01 , 0.015 , 0.1 , 3 ).multiply( 1 );
        this.c.setBuffer( this.cB.buffer );

        // CONNECTIONS

        this.d1.connect( this.fOG );
        this.fOG.connect( this.fO.frequencyInlet );
        this.fO.connect( this.aG ); this.dBGO.connect( this.aG.gain.gain );
        this.aG.connect( this.output );

        this.aG.connect( this.d );
        this.d.connect( this.output );

        this.aG.connect( this.c );
        this.c.connect( this.output );

        this.output.gain.gain.value = 0.15;

    }

    load15Args( fund , iArray , modRate , envelopeRate , modWidth , gainVal ) {

        this.fund = fund;

        this.d1 = new MyDelay( 0 , 0);

        this.oB = new MyBuffer2( 1 , 1 , audioCtx.sampleRate );

        for(const interval of iArray){
            this.oB.sine( interval , 1 ).add( 0 );
        }
    
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
        this.dB.playbackRate = modRate;
        this.dB.loop = true;

        this.dBG = new MyGain( 0 );
        this.dBGO = new MyBuffer2( 1 , 1 , audioCtx.sampleRate );
        this.dBGO.ramp( 0 , 1 , 0.01 , 0.015 , 0.5 , 8 ).add( 0 );
        this.dBGO.playbackRate = envelopeRate;
        this.dBGO.loop = true;

        this.dB.connect( this.dBG ); this.dBGO.connect( this.dBG.gain.gain );
        this.dBG.connect( this.d1.delay.delayTime );
        this.oB.connect( this.d1 );

        this.fO = new MyOsc( 'sine' , 0 );
        this.fOG = new MyGain( modWidth );

        this.aG = new MyGain( 0 );

        // CONNECTIONS

        this.d1.connect( this.fOG );
        this.fOG.connect( this.fO.frequencyInlet );
        this.fO.connect( this.aG ); this.dBGO.connect( this.aG.gain.gain );
        this.aG.connect( this.output );

        this.output.gain.gain.value = gainVal;

    }

    load15ArgsB( fund , iArray , modRate , envelopeRate , modWidth , gainVal ) {

        console.log( `fund: ${fund} , iArray: ${iArray} , modRate: ${modRate} , envelopeRate: ${envelopeRate} ,  modWidth: ${modWidth} , gainVal: ${gainVal}`);

        this.fund = fund;

        this.d1 = new MyDelay( 0 , 0);

        this.oB = new MyBuffer2( 1 , 1 , audioCtx.sampleRate );

        for(const interval of iArray){
            this.oB.sine( interval , 1 ).add( 0 );
        }
    
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
        this.dB.playbackRate = modRate;
        this.dB.loop = true;

        this.dBG = new MyGain( 0 );
        this.dBGO = new MyBuffer2( 1 , 1 , audioCtx.sampleRate );
        this.dBGO.ramp( 0 , 1 , 0.5 , 0.5 , 1 , 1 ).add( 0 );
        this.dBGO.playbackRate = envelopeRate;
        this.dBGO.loop = true;

        this.dB.connect( this.dBG ); this.dBGO.connect( this.dBG.gain.gain );
        this.dBG.connect( this.d1.delay.delayTime );
        this.oB.connect( this.d1 );

        this.fO = new MyOsc( 'sine' , 0 );
        this.fOG = new MyGain( modWidth );

        this.aG = new MyGain( 0 );

        // CONNECTIONS

        this.d1.connect( this.fOG );
        this.fOG.connect( this.fO.frequencyInlet );
        this.fO.connect( this.aG ); this.dBGO.connect( this.aG.gain.gain );
        this.aG.connect( this.output );

        this.output.gain.gain.value = gainVal;

    }

    play( startTime ) {

        this.oB.startAtTime( startTime );
        this.dB.startAtTime( startTime );
        this.dBGO.startAtTime( startTime );

        if( this.aB ){
            this.aB.startAtTime( startTime );
        }

        if( this.fO ){
            this.fO.startAtTime( startTime );
        }

    }

}