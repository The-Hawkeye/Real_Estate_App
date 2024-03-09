// import React from 'react'

export default function CreateListing() {
  return (
    <main className='p-3 max-w-4xl mx-auto'>
        <h1 className='text-3xl font-semibold text-center my-7'>Create Listing</h1>
        <form className='flex flex-col sm:flex-row gap-4'>
            <div className='flex flex-col gap-4 flex-1'>
                <input type="text" placeholder="Name" className="border p-3 rounded-lg" id='name' maxLength={"62"} minLength={"10"} required></input>
                <textarea type="text" placeholder="Description" className="border p-3 rounded-lg" id='description' required></textarea>
                <input type="text" placeholder="Address" className="border p-3 rounded-lg" id='address'required></input>
                <div className='flex gap-6 flex-wrap'>
                    <div className='flex gap-2'> 
                        <input type='checkbox' id='sale' className='w-5'></input>
                        <span>Sell</span>
                    </div>

                    <div className='flex gap-2'> 
                        <input type='checkbox' id='rent' className='w-5'></input>
                        <span>Rent</span>
                    </div>

                    <div className='flex gap-2'> 
                        <input type='checkbox' id='parking' className='w-5'></input>
                        <span>Parking Spots</span>
                    </div>

                    <div className='flex gap-2'> 
                        <input type='checkbox' id='furnished' className='w-5'></input>
                        <span>Furnished</span>
                    </div>

                    <div className='flex gap-2'> 
                        <input type='checkbox' id='offer' className='w-5'></input>
                        <span>Offer</span>
                    </div>
                </div>
                <div className="flex flex-wrap gap-6">
                    <div className="flex items-center gap-2">
                        <input className='border p-3 border-gray-300 rouded-lg' type='number' id='bedroom' min="1" max="10" required></input>
                        <span>Bedrooms</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <input className='border p-3 border-gray-300 rouded-lg' type='number' id='bathrooms' min="1" max="10" required></input>
                        <span>Baths</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <input className='border p-3 border-gray-300 rouded-lg' type='number' id='regularPrice' min="1" max="10" required></input>
                            <div className="flex flex-col items-center">
                                <p>Regular Price</p>
                                <span className="text-xs">($ / month)</span>
                            </div>
                            
                    </div>
                    <div className="flex items-center gap-2">
                        <input className='border p-3 border-gray-300 rouded-lg' type='number' id='discountPrice' min="1" max="10" required></input>
                        <div className="flex flex-col items-center">
                           <p>Discount Price</p>
                            <span className="text-xs">($ / month)</span>
                        </div>
                        
                    </div>
                </div>
            </div>
            <div className="flex flex-col flex-1">
                <p className="font-semibold">Images: 
                <span className="font-normal text-gray-600 ml-2">The first image will be the cover(max6)</span>
                </p>
                <div className="flex gap-4">
                    <input className="border border-gray-300 p-3 rounded w-full" type="file" multiple accept="image/*" id="images" />
                    <button className="p-3 border border-green-700 text-green-700 rounded uppercase hover:shadow-lg disabled:opacity-60%">Upload</button>
                </div>
                <button className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-60">Submit</button>
            </div>
            
        </form>
    </main>
  )
}