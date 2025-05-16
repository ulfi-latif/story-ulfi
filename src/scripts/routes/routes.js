import HomePage from "/scripts/pages/home/home-page.js";
import AddPage from "/scripts/pages/add/add-page.js";


const routes = {
  '/': new HomePage(),  
  '/add': AddPage,       
};

export default routes;
