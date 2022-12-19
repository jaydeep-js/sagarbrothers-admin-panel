// import { FormOption } from "../compoenents/FormOption";
import { Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import { useState } from 'react';
import { Form } from '../compoenents/Form';
import { FormFooter } from '../compoenents/FormFooter';
import { FormOption } from '../compoenents/FormOption';

const Optionpage = () => {
  const [activeTab, setActiveTab] = useState('1');

  return (
    <>
      <Nav tabs className="p-3">
        <NavItem>
          <NavLink className={activeTab === '1' ? 'active' : ''} onClick={() => setActiveTab('1')}>
            Header
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink className={activeTab === '2' ? 'active' : ''} onClick={() => setActiveTab('2')}>
            Footer
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink className={activeTab === '3' ? 'active' : ''} onClick={() => setActiveTab('3')}>
            Option
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={activeTab} className="p-3">
        <TabPane tabId="1">
          <Form />
        </TabPane>
        <TabPane tabId="2">
          <FormFooter />
        </TabPane>
        <TabPane tabId="3">
          <FormOption />
        </TabPane>
      </TabContent>
    </>
  );
};

export default Optionpage;
