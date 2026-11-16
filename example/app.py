
import streamlit as st

from openai import OpenAI

from spase.assistant import answer_question


st.set_page_config(
    page_title="SPASE Intelligence",
    page_icon="☀️",
    layout="wide",
)


# initialize the API client
@st.cache_resource
def get_client():
    return OpenAI(
        api_key=st.secrets["OPENAI_API_KEY"]
    )


client = get_client()


# initialize conversation state
if "messages" not in st.session_state:
    st.session_state.messages = []

if "previous_response_id" not in st.session_state:
    st.session_state.previous_response_id = None


# application header
st.title("☀️ SPASE Intelligence")

st.caption(
    "Solar Panel Assessment and Siting Engine | "
    "Ask questions about NYC building solar potential."
)


# reset conversation
if st.sidebar.button("New conversation"):
    st.session_state.messages = []
    st.session_state.previous_response_id = None
    st.rerun()


# display previous messages
for message in st.session_state.messages:

    with st.chat_message(message["role"]):
        st.markdown(message["content"])


# chat input
if prompt := st.chat_input(
    "Ask about rooftop or facade solar potential..."
):

    # display user question
    st.session_state.messages.append({
        "role": "user",
        "content": prompt,
    })

    with st.chat_message("user"):
        st.markdown(prompt)

    # generate assistant response
    with st.chat_message("assistant"):

        try:
            with st.spinner("Analyzing SPASE building inventory..."):

                answer, response_id = answer_question(
                    client=client,
                    question=prompt,
                    previous_response_id=(
                        st.session_state.previous_response_id
                    ),
                )

            st.markdown(answer)

            # preserve conversation context
            st.session_state.previous_response_id = response_id

            st.session_state.messages.append({
                "role": "assistant",
                "content": answer,
            })

        except Exception as error:

            st.error(
                f"Something went wrong: {error}"
            )
