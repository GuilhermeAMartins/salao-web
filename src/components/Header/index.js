const Header = () =>{
    return (
        <header className='container-fluid d-flex justify-content-end'>
            <div className='d-flex align-items-center'>
                <div>
                    <span className="d-block m-0 p-0 text-white">Barbearia teste</span>
                    <small className="m-0 p-0">Plano Gold</small>
                </div>
                <img src="https://files.passeidireto.com/1cc481c0-d28a-4f01-814f-1d9c0d3d2a26/1cc481c0-d28a-4f01-814f-1d9c0d3d2a26.jpeg" alt=""/>
                <span className='mdi mdi-chevron-down text-white'></span>
            </div>
        </header>
    );
};


export default Header;