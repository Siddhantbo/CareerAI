import DatePicker from 'react-datepicker'

const Section = ({
  title,
  sectionKey,
  items,
  fields,
  handleArrayChange,
  addSectionItem,
  removeSectionItem
}) => (
  <div className='space-y-4 border border-gray-300 p-6 shadow-sm rounded-lg'>
    <h2 className='text-xl font-semibold text-gray-800'>{title}</h2>
    {items.map((item, index) => (
      <div
        key={index}
        className='border border-gray-200 p-4 rounded-lg shadow-sm space-y-2'
      >
        <div className='flex justify-between items-end'>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full'>
            {fields.map(field =>
              field === 'date' ||
              field === 'startDate' ||
              field === 'endDate' ? (
                <div key={field}>
                  <DatePicker
                    selected={item[field] ? item[field] : null}
                    onChange={date => {
                      handleArrayChange(index, field, sectionKey, date)
                    }}
                    // minDate={new Date()}
                    dateFormat='dd-MM-yyyy'
                    placeholderText={field}
                    className={`input border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-[#4DC3AB]`}
                    style={{ height: '48px' }}
                  />
                </div>
              ) : (
                <input
                  key={field}
                  type='text'
                  placeholder={field}
                  value={item[field] || ''}
                  onChange={e =>
                    handleArrayChange(index, field, sectionKey, e.target.value)
                  }
                  className='input border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-[#4DC3AB]'
                />
              )
            )}
          </div>
          <button type='button' onClick={() => removeSectionItem(index)}>
            <img src='/assets/DeleteButton.svg' alt='Delete' className='ml-3' />
          </button>
        </div>
      </div>
    ))}
    <button
      type='button'
      onClick={addSectionItem}
      className='text-sm font-semibold p-2 rounded-lg text-[#005151] border border-[#005151] bg-[#e5f2ea] hover:bg-[#d9ece1] px-4 py-2'
    >
      Add {title}
    </button>
  </div>
)

export default Section
