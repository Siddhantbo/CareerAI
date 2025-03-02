import axios from 'axios'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Link, useParams } from 'react-router-dom'
import PageLoader from '../../component/PageLoader'
import Rating from 'react-rating'
import { axiosInstance, endPoints } from '../../api/axios'

const FeedBack = () => {
  const { id } = useParams()
  const [feedbackList, setFeedbackList] = useState([])
  const [activeIndex, setActiveIndex] = useState(null)
  const [loader, setLoader] = useState(false)

  useEffect(() => {
    const getInterview = async () => {
      try {
        setLoader(true)
        const { data } = await axiosInstance.get(
          `${endPoints.interview.userAnswer}/${id}`
        )
        setFeedbackList(data?.data)
        setLoader(false)
      } catch (error) {
        toast.error(error.response?.data?.message)
        setLoader(false)
      }
    }

    getInterview()
  }, [id])

  const toggleAccordion = index => {
    setActiveIndex(prevIndex => (prevIndex === index ? null : index))
  }

  return (
    <div>
      <div className='flex justify-between items-center max-sm:flex-col max-sm:mb-4'>
        <h2 className='text-4xl font-semibold text-green-700 leading-[60px] max-sm:mb-2'>
          Congratulations 🎉
        </h2>
        <Link
          to='/user/live-interview'
          className='bg-[#e5f2ea] hover:bg-[#d9ece1] text-[#005151] font-semibold py-2 px-4 rounded-md'
        >
          Go Home
        </Link>
      </div>
      <h4 className='text-lg font-semibold'>Here is your interview feedback</h4>

      <h3 className='text-[16px] leading-[27px] text-[#464646] mt-4 mb-6 font-normal'>
        Find below interview questions with the correct answer, your answer, and
        feedback for improvement.
      </h3>
      <div className='p-5'>
        {loader ? (
          <li className='text-center py-4'>
            <div className='flex justify-center items-center'>
              <PageLoader />
            </div>
          </li>
        ) : (
          feedbackList &&
          feedbackList.map((feedback, index) => (
            <div className='border-b border-slate-200' key={index}>
              <button
                onClick={() => toggleAccordion(index)}
                className='w-full flex justify-between items-center py-5 text-slate-800 font-semibold'
              >
                <span  className='text-[18px]'>
                  {index + 1}. {feedback.question}
                </span>
                <span
                  id={`icon-${index}`}
                  className='text-slate-800 transition-transform duration-300'
                >
                  {activeIndex === index ? (
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 16 16'
                      fill='currentColor'
                      className='w-4 h-4'
                    >
                      <path d='M3.75 7.25a.75.75 0 0 0 0 1.5h8.5a.75.75 0 0 0 0-1.5h-8.5Z' />
                    </svg>
                  ) : (
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 16 16'
                      fill='currentColor'
                      className='w-4 h-4'
                    >
                      <path d='M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z' />
                    </svg>
                  )}
                </span>
              </button>
              <div
                id={`content-${index}`}
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  activeIndex === index ? 'max-h-screen' : 'max-h-0'
                }`}
              >
                <div className='pb-5 text-sm text-slate-500'>
                  <p className='flex items-center justify-start space-x-3'>
                    <strong className='font-bold text-slate-700 text-[16px] leading-[27px]'>
                      Rating:
                    </strong>
                    <div className='relative flex items-center'>
                      <Rating
                        initialRating={feedback.rating / 2}
                        readonly
                        emptySymbol={
                          <svg
                            className='w-6 h-6 text-slate-300'
                            fill='currentColor'
                            viewBox='0 0 24 24'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <path d='M12 17.27L18.18 21 16.54 13.97 22 9.24 14.81 8.63 12 2 9.19 8.63 2 9.24 7.46 13.97 5.82 21 12 17.27z'></path>
                          </svg>
                        }
                        fullSymbol={
                          <svg
                            className='w-6 h-6 text-yellow-400'
                            fill='currentColor'
                            viewBox='0 0 24 24'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <path d='M12 17.27L18.18 21 16.54 13.97 22 9.24 14.81 8.63 12 2 9.19 8.63 2 9.24 7.46 13.97 5.82 21 12 17.27z'></path>
                          </svg>
                        }
                        fractions={2}
                      />
                      {/* <span className='ms-3 rounded-full py-1'>
                        ({feedback.rating})
                      </span> */}
                    </div>
                  </p>
                  <p>
                    <strong className='font-bold text-slate-700 text-[16px] leading-[27px]'>
                      Your Answer:
                    </strong>{' '}
                    <span className='text-[#464646] text-[16px] leading-[27px]'>{feedback.userAns}</span>
                  </p>
                  <p className='mt-2'>
                    <strong className='font-bold text-slate-700 text-[16px] leading-[27px]'>
                      Correct Answer:
                    </strong>{' '}
                    <span className='text-[#464646] text-[16px] leading-[27px]'>
                      {feedback.correctAns}
                    </span>
                  </p>
                  <p className='mt-2'>
                    <strong className='font-bold text-slate-800 text-[16px] leading-[27px]'>
                      Feedback:
                    </strong>{' '}
                    <span className='text-[#464646] text-[16px] leading-[27px]'> {feedback.feedback}</span>
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default FeedBack
