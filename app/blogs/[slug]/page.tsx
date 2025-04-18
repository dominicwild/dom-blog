import React from 'react';

const Page = ({params}: { params: string[] }) => {

    return (
        <div className={"container text-white"}>
            {JSON.stringify(params)}
        </div>
    );
};

export default Page;