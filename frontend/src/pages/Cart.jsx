import Navigation from "../components/layout/Navigation/StaticNavigationPC"
import CartSection from "../components/sections/CartSection"
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

function Cart() {

  const [notice, setNotice] = useState(true);
  const [agree, setAgree] = useState(false);
  const navigate = useNavigate();

  
  return (
    <div className='w-full bg-[#f7f7f7]'>
        <Navigation/>

        <CartSection/>
        {notice && 
          
          <div className='fixed inset-0 bg-black/50 flex justify-center items-center z-100 p-5'>
            <div className="
                    bg-navyblue
                    py-10
                    lg:py-15
                    p-5 md:p-10
                    rounded-2xl
                    w-full
                    max-w-2xl
                    max-h-[90vh]
                    overflow-y-auto
                    scrollbar-none
                    scrollbar-thumb-[#B9B9B9]
                    scrollbar-track-[#E2E2E2] flex flex-col gap-10
                    font-akagi
                    font-bold
                    text-[#ffffff]
                    items-center
                ">
                    <div className='text-center'>
                      <h1 className='text-4xl tracking-wide font-extrabold text-yellow'>RULES & REGULATIONS</h1>
                    </div>
                    <div className='w-full h-full bg-[#ffffff] text-darkblue font-medium rounded-lg p-5'>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse consectetur porta bibendum. Vestibulum in auctor eros, convallis bibendum ipsum. Suspendisse potenti. Cras tellus libero, sodales nec cursus eu, commodo eu purus. Nam id posuere purus, sit amet sodales risus. Fusce massa ipsum, blandit sodales tellus vitae, lobortis pellentesque nisi. Quisque augue turpis, pharetra eu convallis in, hendrerit quis elit. Donec euismod pellentesque molestie. Aliquam hendrerit gravida tellus ut ultrices. Vestibulum non iaculis ipsum. Vestibulum arcu augue, maximus a diam in, mollis sollicitudin libero. Nulla dolor ex, dignissim eu lorem eu, pellentesque tempus mi. Cras quis augue sit amet erat vestibulum volutpat sit amet in nisl.

                      Vivamus ipsum neque, eleifend sit amet accumsan at, malesuada quis sapien. Suspendisse elementum elit quis rutrum vehicula. Morbi quis pretium dolor. Ut a convallis nunc. Cras faucibus tellus ac tellus finibus, vitae lobortis lorem fermentum. Proin nunc elit, posuere ultrices ornare vitae, dictum at augue. Nullam sem diam, aliquet in urna eu, molestie auctor risus. Nunc posuere, dui nec convallis venenatis, magna lacus imperdiet orci, at cursus odio magna vel neque. Mauris at varius velit, ut molestie nibh. Integer lobortis erat est, sit amet dapibus massa maximus ut. Ut nec facilisis urna. Donec feugiat tellus eget tortor vestibulum vulputate. Pellentesque tortor diam, commodo at massa sit amet, blandit rhoncus enim. Vivamus suscipit hendrerit sodales. Quisque sodales massa pharetra sem egestas sollicitudin. Curabitur sodales interdum est.

                      Suspendisse aliquet lobortis libero, eget gravida eros pellentesque et. Aenean nec lectus id nunc sollicitudin lobortis. Pellentesque dictum ac leo quis fringilla. Suspendisse potenti. Praesent quis consequat eros. Sed ac mi eleifend magna vehicula maximus a semper sapien. Quisque maximus tristique dignissim. Aenean tristique luctus vestibulum.

                      Aenean sapien leo, elementum in orci nec, dapibus tincidunt urna. Pellentesque sed ultricies massa. Sed posuere dignissim felis, at cursus risus posuere eget. Aenean auctor, eros ac malesuada tempor, felis neque euismod ex, ullamcorper pulvinar ipsum nunc ac est. Curabitur ac leo risus. Donec elementum nibh magna, id aliquam eros maximus sit amet. Sed non accumsan orci, eu porttitor lectus. Integer mattis dictum odio, vitae dignissim metus fringilla eget. In vehicula consectetur libero. Donec nulla urna, viverra vel semper sit amet, ullamcorper non lorem. Phasellus ac vulputate metus. Etiam sodales ligula nunc, et bibendum sapien eleifend eget. Praesent auctor lacinia diam, nec mattis nisl convallis luctus.

                      Cras sodales vestibulum eros at iaculis. Sed in malesuada enim. Nunc eu metus sit amet urna consequat imperdiet vitae ut dolor. Phasellus tristique in massa sed consectetur. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris posuere est ut fringilla vehicula. Nunc eleifend nisi tortor, eget facilisis diam fermentum vel. Ut eu accumsan leo, eget molestie leo. Etiam interdum ornare consectetur. Aenean quam enim, mollis id tempor vitae, rhoncus euismod turpis. Duis sollicitudin quam non orci interdum consequat. Donec efficitur dapibus mauris vitae laoreet. Morbi a viverra lorem.

                      Donec pretium quam a diam eleifend facilisis. Morbi cursus diam quis nibh gravida dictum. Pellentesque ac sapien est. Sed sagittis mauris vel egestas vehicula. Fusce iaculis, justo condimentum bibendum viverra, neque dolor viverra mi, sit amet dapibus turpis nibh vitae nibh. Etiam condimentum neque nulla, sed consequat turpis varius vel. Phasellus et ullamcorper nunc. Nam ultrices laoreet urna sed blandit. Fusce sed varius tellus, quis tincidunt nisi. Phasellus tempus gravida condimentum. Sed ut ultrices sapien, sed eleifend magna. Fusce porttitor, tortor vel tempor scelerisque, lacus nunc ultrices lacus, ac malesuada est ligula sit amet risus. Cras metus est, dictum quis tincidunt eget, finibus rhoncus mi. Nullam mollis, felis nec pulvinar venenatis, libero purus imperdiet velit, sed dictum diam libero vel mi. Duis elementum, est sit amet blandit mattis, orci nisi semper turpis, sed luctus quam leo et justo.

                      Proin tincidunt eros ut purus rhoncus, ut tincidunt mi porttitor. Fusce interdum, neque eu fermentum tincidunt, lacus ante interdum neque, vehicula ullamcorper ligula justo sit amet metus. Curabitur malesuada iaculis leo eget mattis. Vestibulum quis metus mollis, venenatis turpis in, volutpat purus. Vestibulum scelerisque non mi sed sollicitudin. Aliquam sit amet laoreet lectus. Donec porta enim in risus dignissim lacinia eu id elit. In velit lacus, ultrices vel lacus ut, vulputate lacinia nisl. Maecenas ut risus sit amet ligula lacinia egestas eu consectetur nibh. Integer vel accumsan magna. Nullam nunc risus, viverra ac fringilla tincidunt, dignissim quis magna. Integer ac ligula nec lectus laoreet vehicula eu ullamcorper diam.

                      Suspendisse dictum tellus ante, eget rutrum libero efficitur id. Cras eget enim quis risus tristique vestibulum. Sed eget venenatis mi. Pellentesque porta vel lectus et hendrerit. Fusce mi ipsum, aliquet eget suscipit vitae, eleifend in ex. Nullam volutpat volutpat est vitae consectetur. Sed viverra elit et elit blandit, at congue magna blandit. Aliquam erat volutpat. Nunc volutpat ligula euismod velit efficitur semper. Etiam vel fermentum neque. Phasellus sit amet cursus augue, vitae lacinia ex. Phasellus fringilla eleifend purus in efficitur.

                      Aliquam varius eu augue vitae euismod. Ut eget arcu eget velit mattis fermentum sit amet id orci. Sed iaculis luctus erat, sed rhoncus nisi euismod vel. Praesent ut purus id tellus mollis rutrum vitae vitae sapien. Donec dapibus purus ac mauris blandit, eget sagittis risus ornare. Ut lorem tortor, hendrerit sit amet efficitur id, molestie euismod nibh. Vestibulum ornare ut magna sollicitudin vestibulum. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aenean in quam ut velit sagittis convallis. In hac habitasse platea dictumst. Mauris quis est non metus congue dictum non nec arcu. Integer ullamcorper nisl at hendrerit tincidunt.

                      Nam eu ullamcorper libero. Sed feugiat tempor faucibus. Nullam eu lobortis erat. Quisque a suscipit velit. Sed in ex cursus, tristique lacus in, consectetur tellus. Mauris lacus lorem, varius vel quam eget, mollis auctor risus. Suspendisse ornare posuere turpis, non volutpat tellus egestas a. Duis posuere convallis sem vel maximus. Nulla sit amet diam nisi. Nullam posuere tincidunt bibendum. Pellentesque velit justo, sollicitudin nec eleifend quis, tincidunt dictum tellus.
                    </div>
                    <div className='px-3 flex flex-row gap-2'>
                      <input 
                        checked={agree}
                        onChange={(e) => setAgree(e.target.checked)}
                        type='checkbox'/>
                      <h1 
                        className='font-medium text-md'>I agree to the rules and regulations, as well as the terms and conditions of renting bikes in 3Jremy's Rent A Bike!</h1>
                    </div>

                    <div className='w-full flex justify-between items-center'>
                      <div 
                        onClick={() => {navigate('/')}}
                        className='cursor-pointer border-2 border-gray px-3 py-0.5 rounded-lg text-gray font-medium'>
                        Back
                      </div>

                      <div
                        onClick={() => {
                            setNotice(!notice);
                            setAgree(false);
                        }}
                        className={`border-2 px-3 py-0.5 rounded-lg font-medium ${
                            agree
                                ? "bg-yellow text-navyblue cursor-pointer"
                                : "bg-gray text-navyblue cursor-not-allowed opacity-50 pointer-events-none"
                        }`}
                    >
                        Continue
                    </div>
                    </div>
                </div>
          </div>
        }
    </div>
  );
}

export default Cart;