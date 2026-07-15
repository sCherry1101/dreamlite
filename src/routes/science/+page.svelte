<script>
  import Button from "$component/Button"
</script>

<div id="science_box">
  <h1>Choose your diagram below</h1>
  
  <div class="card-group">
    <div class="subject-card">
      <h2>Cell Organelles</h2>
      <Button href="/science/cell-organelles" variant="primary">Click here</Button>
    </div>
    
    <div id="periodic_table" class="subject-card">
      <h2>Periodic Table</h2>
      <Button href="/science/periodic-table" variant="primary">Click here</Button>
    </div>
  </div>
</div>

<style>
  #science_box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2rem; 
    width: 90vw;
    max-width: 600px;
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

  h2 {
    font-family: 'Outfit', 'Inter', sans-serif;
    font-size: 1.25rem;
    font-weight: 500;
    color: #ffffff;
    margin-bottom: 0.5rem;
  }

  .card-group {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    width: 100%;
  }

  .subject-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 1.5rem;
    background: rgba(255, 255, 255, 0.01);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    transition: all 0.3s ease;
  }

  .subject-card:hover {
    background: rgba(255, 255, 255, 0.03);
    border-color: rgba(255, 255, 255, 0.15);
  }
</style>
