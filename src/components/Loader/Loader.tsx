import ReactLoading from "react-loading";

const Loader: React.FC = () => (
  <div className="flex justify-center items-center h-screen">
    <ReactLoading type="spin" color="#309C4D" height={50} width={50} />
  </div>
);

export default Loader;
