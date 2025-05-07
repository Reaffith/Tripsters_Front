import { Dispatch, SetStateAction } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import './ErrorBlock.scss';

type Params = {
  error: string;
  setError: Dispatch<SetStateAction<string>>;
}


export const ErrorBlock: React.FC<Params> = ({error, setError}) => {
    return (
      <div className="error_block">
        <div className="error_block__top">
          <h2 className="error_block__top--header">
            Oops, something went wrong
          </h2>
          
          <IoMdCloseCircle onClick={() => setError('')}/>
        </div>

        <p className="error_block__text">
          {`Error: ${error}`}
        </p>
      </div>
    )
}