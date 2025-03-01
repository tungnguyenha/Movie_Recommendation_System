import Footer from "../Component/Footer";
import Header from "../Component/Header";

// eslint-disable-next-line react/prop-types
function DefaultLayout({children}) {
    return ( <div>
        <Header/>
        {children}
        <Footer/>
    </div> );
}

export default DefaultLayout;