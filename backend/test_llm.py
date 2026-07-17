from dotenv import load_dotenv

from app.services.llm_service import generate_answer


load_dotenv()


context = """
[Source 1]
Page: 2
Chunk ID: test-chunk-1
Content:
The experiment used a convolutional neural network trained for 20 epochs.

[Source 2]
Page: 4
Chunk ID: test-chunk-2
Content:
The model achieved 91 percent accuracy on the validation dataset.
"""


answer = generate_answer(
    question="What accuracy score was acheived?",
    context=context,
)

print(answer)