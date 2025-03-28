const baseURL = "http://wdd330-backend.onrender.com";

function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Bad Response");
  }
}

export default class ExternalServices {
  constructor() {
    // Constructor has no code needed at this time
  }
  
  async getData(category) {
    const response = await fetch(baseURL + `/products/search/${category}`);
    const data = await convertToJson(response);
    return data.Result;
  }
  
  async findProductById(id) {
    const response = await fetch(baseURL + `/product/${id}`);
    const data = await convertToJson(response);
    return data.Result;
  }
  
  async checkout(payload) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    };
    
    const response = await fetch(baseURL + "/checkout", options);
    const data = await convertToJson(response);
    return data;
  }
}
