<script>

</script>

<main>

    <div class="bigBox">
        <div class="header">
            <span class="title"><img class="image" alt="Information Symbol" width="23" src="../../images/iBox.png"/>LAUNCHER INFORMATION</span>
            <span class="gametext">JUST SOME FRIENDLY LAUNCHER INFORMATION HERE :)</span>
        </div>
        <div class="content">
            Welcome to Fusion, the best client. Made with love and a bit of design ideas from Lunar... It took me hours to look at and judge how lunar looked don't judge...
        </div>
    </div> 
</main>

<style>
    main {
        height: 100%;
        display: flex;
        align-items: stretch;
        justify-content: center;
        align-content: stretch;
        flex-direction: column;
    }
    .bigBox {
        display: flex;
        flex: 1 0 0;
        position: relative;
        bottom: 0px;
        margin: 20px 50px;

        border-radius: 6px;
        background-color: blue;

        align-items: stretch;
        justify-content: center;
        align-content: stretch;
        flex-direction: column;

        overflow: hidden;
    }
    .gametext {
        display: inline-block;
        font-size: 12px;
        letter-spacing: 1.5px;
        transform: translateY(-2px);
        text-shadow: 0 0.1em 0.2em rgba(0,0,0,0.35);
    }
    .header {
        padding: 15px;
        flex: 2 0 0;
        background-color: rgb(15, 16, 16);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
    }
    .content {
        padding: 15px;
        flex: 9 0 0;
        background-color: rgb(33, 36, 33);
        flex-wrap: wrap;
    }
    .image {
        filter: brightness(0) saturate(100%) invert(100%) sepia(22%) saturate(1%) hue-rotate(49deg) brightness(109%) contrast(101%);
        display: inline; 
        transform: translateY(-2px);
        margin: 0 7px;
    }
    .title {
        font-size: 25px;
        font-weight: bold;
        letter-spacing: 0.5px;
        text-shadow: 0 0.1em 0.2em rgba(0,0,0,0.35);
    }
</style>