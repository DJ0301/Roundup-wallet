// import React, { useState } from 'react';

// function Home() {
//   const [activeComponent, setActiveComponent] = useState(null);
//   const [mode, setMode] = useState('preWallet'); 
//   const renderComponent = (component) => {
//     setActiveComponent(component);
//   };

//   const switchToPostWalletMode = () => {
//     setMode('postWallet');
//     setActiveComponent(null);
//   };

//   const switchToPreWalletMode = () => {
//     setMode('preWallet');
//     setActiveComponent(null);
//   };

//   return (
//     <div >
//       <div className='Nav'>
//         <img src={Logo} id='Logo'/>
//         <div>
//           {/* Buttons to switch between 'Form' and 'Details' modes */}
//           <button onClick={switchToPostWalletMode}>Form</button>
//           <button onClick={switchToPreWalletMode}>Details</button>
//         </div>
//       </div>
//       <div className='main'>
//         {mode === 'preWallet' && (
//           <div className='container mx-auto py-8 px-4 lg:px-16 xl:px-32'>
//             <button className='' onClick={() => renderComponent(<SupplierForm />)}>Add Supplier</button>
//             <button className='' onClick={() => renderComponent(<ManufacturerForm />)}>Add Manufacturer</button>
//             <button className='' onClick={() => renderComponent(<DistributorForm />)}>Add Distributor</button>
//             <button className='' onClick={() => renderComponent(<RetailerForm />)}>Add Retailer</button>
//           </div>
//         )}
//         {mode === 'postWallet' && (
//             <div>
//               <button onClick={() => renderComponent(<SupplierDetails />)}>Details</button>
//               <button onClick={() => (window.location.href = 'https://insightss.streamlit.app/')}>
//                 Optimize with AI
//               </button>
//             </div>
//           )}
//       </div>
//     </div>
//   );
// }

// export default Home;
