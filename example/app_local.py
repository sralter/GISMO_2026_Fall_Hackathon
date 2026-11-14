import streamlit as st

from spase.assistant import answer_question


st.set_page_config(
    page_title="SPASE Intelligence",
    page_icon="☀️",
    layout="wide",
)

st.title("☀️ SPASE Intelligence")
st.caption("Local AI · Geospatial Solar Assessment")


if "conversation" not in st.session_state:
    st.session_state.conversation = []

if "messages" not in st.session_state:
    st.session_state.messages = []


if st.sidebar.button("New conversation"):
    st.session_state.conversation = []
    st.session_state.messages = []
    st.rerun()


# display previous messages
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])


if prompt := st.chat_input("Ask SPASE..."):

    with st.chat_message("user"):
        st.markdown(prompt)

    st.session_state.messages.append({
        "role": "user",
        "content": prompt,
    })

    with st.chat_message("assistant"):

        try:
            with st.spinner("Consulting local SPASE intelligence..."):

                answer, conversation = answer_question(
                    question=prompt,
                    conversation=st.session_state.conversation,
                )

            st.markdown(answer)

            st.session_state.conversation = conversation

            st.session_state.messages.append({
                "role": "assistant",
                "content": answer,
            })

        except Exception as error:
            st.error(f"Local model error: {error}")