// import { FormProduct } from "../compoenents/FormProduct";

// const Productpage = () => {
//   return (
//     <div>
//       <FormProduct />
//     </div>
//   );
// };

// export default Productpage;

// import { FormOption } from "../compoenents/FormOption";
import { Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import { useState } from 'react';
import { FormCategory } from '../compoenents/FormCategory';
import { FormProducts } from '../compoenents/FormProducts';


const Optionpage = () => {
  const [activeTab, setActiveTab] = useState('1');

  return (
    <>
      <Nav tabs className="p-3">
        <NavItem>
          <NavLink className={activeTab === '1' ? 'active' : ''} onClick={() => setActiveTab('1')}>
            Category
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink className={activeTab === '2' ? 'active' : ''} onClick={() => setActiveTab('2')}>
            Product
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={activeTab} className="p-3">
        <TabPane tabId="1">
        <FormCategory/>
        </TabPane>
        <TabPane tabId="2">
         <FormProducts/>
        </TabPane>
      </TabContent>
    </>
  );
};

export default Optionpage;


