import axios from "axios";

async function testRateLimiter() {
  for (let i = 1; i <= 10; i++) {
    try {
      const res = await axios.get("http://localhost:5000/user");
      console.log(`Request ${i}:`, res.data);
    } catch (err: any) {
      console.log(`Request ${i}:`, err.message);
    }
  }
}

testRateLimiter();
