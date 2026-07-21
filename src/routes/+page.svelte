<script>
  import Button from "$component/Button"
</script>

<div id="homepage_box">
  <h1>Choose your subject below</h1>
  <div class="button-group">
    <Button href="/science" size="lg" variant="primary">Science</Button>
    <Button href="/maths" size="lg" variant="secondary">Maths</Button>
    <Button href="/iks" size="lg" variant="secondary">IKR</Button>
  </div>
</div>

<style>
  #homepage_box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2rem; 
    width: 90vw;
    max-width: 500px;
    padding: 3rem;
    background: rgba(255, 255, 255, 0.02); 
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    backdrop-filter: blur(16px); 
    box-sizing: border-box;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
    margin: 4rem auto;
    text-align: center;
  }

  h1 {
    font-family: 'Outfit', 'Inter', sans-serif;
    font-size: 1.75rem;
    font-weight: 600;
    color: #ffffff;
    letter-spacing: -0.01em;
  }

  .button-group {
    display: flex;
    gap: 1rem;
    width: 100%;
    justify-content: center;
  }
</style>
